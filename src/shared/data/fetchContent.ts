import { getGuillotineUrlDraft, getGuillotineUrlMaster } from "../../enonic-connection-config";

import {fetchGuillotine} from "./data";

import getQueryMethodKey from './queryKey';

import META_QUERY, {Meta} from "./queries/_getMetaData";
import { LOW_PERFORMING_DEFAULT_QUERY } from "./queries/_getDefaultData";

// Shape of content base-data API body
type ContentApiBaseBody = {
    query?: string,                 // Override the default base-data query
    variables?: {                   // GraphQL variables inserted into the query
        path?: string,          // Full content item _path
    }
};

type Result = {
    error?: {
        code: string,
        message: string
    }
}
export type ContentResult<T> = Result & {
    type?: string,
    data?: T
};
type MetaResult = Result & {
    meta?: Meta
};

export type Branch = 'master' | 'draft';




///////////////////////////////////////////////////////////////////////////////// Specific fetch:

const fetchMetaData = async (contentUrl: string, path: string): Promise<MetaResult> => {
    const body: ContentApiBaseBody = {
        query: META_QUERY,
        variables: {
            path
        }
    };
    return await fetchGuillotine<MetaResult>(contentUrl, body, 'meta', path, 'get');
}



const fetchContentFull = async <T>(
    contentUrl: string,
    /* branch: string, appName: string, */
    path: string,
    query: string,
    methodKeyFromQuery?: string,
    variables?: {}
): Promise<ContentResult<T>> => {

    const body: ContentApiBaseBody = {query};
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }
    return await fetchGuillotine<ContentResult<T>>(contentUrl, body, 'data', path, methodKeyFromQuery);
};



///////////////////////////////////////////////////////////////////////////////// Error checking:

const getCleanContentPathArrayOrError400 = (contentPath: string | string[]): string[] => {
    const isArray = Array.isArray(contentPath);

    if (typeof contentPath !== 'string' && !isArray) {
        throw Error(JSON.stringify({
            code: 400,
            message: `Unexpected target content _path: contentPath must be a string or pure string array (contentPath (${typeof contentPath}) = "${JSON.stringify(contentPath)})`
        }));
    }

    let contentPathArray = (!isArray)
        ? (contentPath as string).split('/')
        : contentPath as string[];

    contentPathArray = contentPathArray.filter(p => {
        // Check items, remove empty ones
        if (typeof p !== 'string') {
            Error(JSON.stringify({
                code: 400,
                message: `Unexpected target content _path: contentPath must be a string or pure string array (contentPath (${typeof contentPath}) = "${JSON.stringify(contentPath)})`
            }));
        }
        return p.trim()
    });

    // By now, contentPathArray is verified to have the shape we want: a clean string array with no empty items.
    return contentPathArray;
}

const verifyBranchOrError400 = (branch) => {
    if (['draft', 'master'].indexOf(branch) === -1) {
        throw Error(JSON.stringify({
            code: 400,
            message: `Invalid branch - must be 'master' or 'draft' (branch = ${JSON.stringify(branch)}})`
        }))
    }
}



///////////////////////////////////////////////////////////////////////////////// Entry:

type VariablesGetterFunc = (path:string) => {path: string};

type FetcherConfig = {
    querySelector?: {
        [contentType: string]: string
    },
    variablesGetterSelector?: {
        [contentType: string]: VariablesGetterFunc
    },
    firstMethodKey?: boolean,
    /*
    apiConfig?: {
        getGuillotineUrlDraft?: ApiGetterFunc,
        getGuillotineUrlMaster?: ApiGetterFunc
    },
    */
}
// type ApiGetterFunc = (appName:string) => string;



/**
 *
 * @param querySelector Object where keys are content type strings (eg. 'my.app:content-type') and values are guillotine queries to use to fetch data for that content type.
 * @param variablesGetterSelector Object where keys are content types and values are functions. These functions take an path string as an argument and return a guillotine variables object, where 'path' is a mandatory attribute.
 * @param firstMethodKey boolean, default is true.
 *          - firstMethodKey=true: can simplify usage a bit, but ONLY use if all query strings use only one guillotine method call - no queries have more than one (eg. 'get' in the query string 'query($path:ID!){ guillotine { get(key:$path) { type }}}'). The (first) guillotine method call is autodetected from each query string ('get', 'getChildren', 'query' etc), and that string is used in two ways. The response under that key is checked for non-null content (returns 404 error if null), and the returned content is the object below that method-named key (which in turn is under the 'guillotine' key in the response from the guillotine API (in this example: the value of reponseData.guillotine['get']).
 *          - firstMethodKey=false: this disables the autodetection, a 404 error is only returned if no (or empty) object under the 'guillotine' key was found. Otherwise, the entire data object under 'guillotine' is returned, with all method-named keys from the query - not just the data under the method-named key from the query.
 */
const buildContentFetcher = ({querySelector, variablesGetterSelector, firstMethodKey}: FetcherConfig) => {
    /*
    const contentUrlGetters = {
        draft: (apiConfig || {}).getGuillotineUrlDraft || getGuillotineUrlDraft,
        master: (apiConfig || {}).getGuillotineUrlMaster || getGuillotineUrlMaster
    };
    */
    const contentUrlGetters = {
        draft: getGuillotineUrlDraft,
        master: getGuillotineUrlMaster
    };

    querySelector = querySelector || {};
    variablesGetterSelector = variablesGetterSelector || {};

    const defaultGetVariables: VariablesGetterFunc = (path) => ({ path });

    const getQueryAndVariables = (type, path) => {
        // @ts-ignore
        let query = querySelector[type];
        // @ts-ignore
        let getVariables = variablesGetterSelector[type] || defaultGetVariables;

        // Default query and variables if no content-type-specific query was found for the type
        if (!query) {
            console.warn(`${JSON.stringify(path)}: no query has been assigned for the content type ${JSON.stringify(type)}.\n\nThe default data query (_getDefaultData.ts) will be used, but note that this is a development tool and won't scale well in production. It's HIGHLY RECOMMENDED to write a content-type-specialized guillotine query, and add that to querySelector in querySelector.ts!`);
            query = LOW_PERFORMING_DEFAULT_QUERY;
            getVariables = defaultGetVariables;
        }

        return {
            query,
            variables: getVariables(path)
        }
    };


    /**
     * Sends one query to the guillotine API and asks for content type, then uses the type to select a second query and variables, which is sent to the API and fetches content data.
     * @param contentPath string or string array: pre-split or slash-delimited _path to a content available on the API
     * @param branch 'draft' or 'master'
     * @returns ContentResult object: {data?: T, error?: {code, message}}
     */
    const fetchContent = async <T>(
        contentPath: string | string[],
        branch: Branch
    ): Promise<ContentResult<T>> => {

        try {
            verifyBranchOrError400(branch);
            const contentPathArray = getCleanContentPathArrayOrError400(contentPath);

            const path = "/" + contentPathArray.join("/");

            // The first item is interpreted to be the _name of the app.
            const appName = contentPathArray[0];
            const getContentUrl = contentUrlGetters[branch];
            const contentUrl = getContentUrl(appName);

            const metaResult = await fetchMetaData(contentUrl, path);

            if (metaResult.error) {
                return {
                    error: metaResult.error
                };
            }

            const {
                type
                // , displayName, _id, _path      // <-- if using RICH_META_QUERY in queries/_getMetaData.es6
            } = metaResult.meta || {};

            if (!type) {
                return await {
                    error: {
                        code: 500,
                        message: "Server responded with incomplete meta data: missing content 'type' attribute."
                    }
                }
            }

            const {query, variables} = getQueryAndVariables(type, path);
            if (!query.trim()) {
                return await {
                    error: {
                        code: 400,
                        message: `Missing or empty query override for content type ${JSON.stringify(type)}`
                    }
                }
            }

            const methodKeyFromQuery = firstMethodKey
                ? getQueryMethodKey(type, query)
                : undefined;

            return await {
                ...await fetchContentFull(contentUrl, path, query, methodKeyFromQuery, variables),
                type
            };

        } catch (e) {
            console.error(e);
            let error;
            try {
                error = JSON.parse(e.message);
            } catch (e2) {
                error = {
                    code: "Local",
                    message: e.message
                }
            }
            return await {error};
        }
    };

    return fetchContent;
};


export default buildContentFetcher;
