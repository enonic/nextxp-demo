import {ContentApiBaseBody, fetchGuillotine} from "./data";

import getQueryMethodKey from './queryKey';

import META_QUERY, {Meta} from "./queries/_getMetaData";
import { LOW_PERFORMING_DEFAULT_QUERY } from "./queries/_getDefaultData";

import type {QuerySelector, VariablesGetterFunc, VariablesGetterSelector} from "../../selectors/querySelector";


export type ResultMeta = Meta & {
    path: string
}

type Result = {
    error?: {
        code: string,
        message: string
    }
}
export type ContentResult = Result & {
    data?: any,
    meta: ResultMeta
};
type MetaResult = Result & {
    meta?: Meta
};



type FetcherConfig = {
    enonicConnectionConfig: {
        contentApiUrl: string,
        getXpPath: (string)=>string
    }
    querySelector?: QuerySelector,
    variablesGetterSelector?: VariablesGetterSelector,
    firstMethodKey?: boolean,
}


/**
 * Sends one query to the guillotine API and asks for content type, then uses the type to select a second query and variables, which is sent to the API and fetches content data.
 * @param contentPath string or string array: pre-split or slash-delimited _path to a content available on the API
 * @returns ContentResult object: {data?: T, error?: {code, message}}
 */
export type ContentFetcher = (
    contentPath: string | string[]
) => Promise<ContentResult>





///////////////////////////////////////////////////////////////////////////////// Specific fetch:

const fetchMetaData = async (contentUrl: string, path: string): Promise<MetaResult> => {
    const body: ContentApiBaseBody = {
        query: META_QUERY,
        variables: {
            path
        }
    };
    return await fetchGuillotine(contentUrl, body, 'meta', path, 'get') as MetaResult;
}



const fetchContentFull = async <T>(
    contentUrl: string,
    path: string,
    query: string,
    methodKeyFromQuery?: string,
    variables?: {}
): Promise<ContentResult> => {

    const body: ContentApiBaseBody = {query};
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }
    return await fetchGuillotine(contentUrl, body, 'data', path, methodKeyFromQuery) as ContentResult;
};



///////////////////////////////////////////////////////////////////////////////// Error checking:

/** Checks a site-relative contentPath as a slash-delimited string or a string array, and returns a pure site-relative path string (no double slashes, starts with a slash, does not end with one). */
const getCleanContentPathArrayOrThrow400 = (contentPath: string | string[] | undefined): string => {
    if (contentPath === undefined) {
        return ''
    }
    const isArray = Array.isArray(contentPath);

    if (!isArray) {
        if (typeof contentPath !== 'string') {
            throw Error(JSON.stringify({
                code: 400,
                message: `Unexpected target content _path: contentPath must be a string or pure string array (contentPath=${JSON.stringify(contentPath)})`
            }));
        }

        return contentPath;

    } else {
        return (contentPath as string[]).join('/');
    }
}




///////////////////////////////////////////////////////////////////////////////// Entry:



/**
 *
 * @param querySelector Object where keys are content type strings (eg. 'my.app:content-type') and values are guillotine queries to use to fetch data for that content type.
 * @param variablesGetterSelector Object where keys are content types and values are functions. These functions take an path string as an argument and return a guillotine variables object, where 'path' is a mandatory attribute.
 * @param firstMethodKey boolean, default is true.
 *          - firstMethodKey=true: can simplify usage a bit, but ONLY use if all query strings use only one guillotine method call - no queries have more than one (eg. 'get' in the query string 'query($path:ID!){ guillotine { get(key:$path) { type }}}'). The (first) guillotine method call is autodetected from each query string ('get', 'getChildren', 'query' etc), and that string is used in two ways. The response under that key is checked for non-null content (returns 404 error if null), and the returned content is the object below that method-named key (which in turn is under the 'guillotine' key in the response from the guillotine API (in this example: the value of reponseData.guillotine['get']).
 *          - firstMethodKey=false: this disables the autodetection, a 404 error is only returned if no (or empty) object under the 'guillotine' key was found. Otherwise, the entire data object under 'guillotine' is returned, with all method-named keys from the query - not just the data under the method-named key from the query.
 */
const buildContentFetcher = ({enonicConnectionConfig, querySelector, variablesGetterSelector, firstMethodKey}: FetcherConfig): ContentFetcher => {

    const { contentApiUrl, getXpPath } = enonicConnectionConfig;

    const theQuerySelector = querySelector || {};
    const theVariablesGetterSelector = variablesGetterSelector || {};

    const defaultGetVariables: VariablesGetterFunc = (path) => ({ path });

    const getQueryAndVariables = (type: string, path: string) => {
        // @ts-ignore
        let query = theQuerySelector[type];
        // @ts-ignore
        let getVariables = theVariablesGetterSelector[type] || defaultGetVariables;

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
     * @returns ContentResult object: {data?: T, error?: {code, message}}
     */
    const fetchContent: ContentFetcher = async (
        contentPath: string | string[]
    ): Promise<ContentResult> => {

        try {
            const siteRelativeContentPath = getCleanContentPathArrayOrThrow400(contentPath);
            const xpContentPath = getXpPath(siteRelativeContentPath);

            console.log("siteRelativeContentPath", siteRelativeContentPath);
            console.log("xpContentPath", xpContentPath);

            const metaResult = await fetchMetaData(contentApiUrl, xpContentPath);

            if (metaResult.error) {
                // @ts-ignore
                return await {
                    error: metaResult.error
                };
            }

            const { type } = metaResult.meta || {};

            if (!type) {
                // @ts-ignore
                return await {
                    error: {
                        code: 500,
                        message: "Server responded with incomplete meta data: missing content 'type' attribute."
                    }
                }
            }

            const {query, variables} = getQueryAndVariables(type, xpContentPath);
            if (!query.trim()) {
                // @ts-ignore
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
                ...await fetchContentFull(contentApiUrl, xpContentPath, query, methodKeyFromQuery, variables),
                meta: {
                    path: siteRelativeContentPath,
                    type
                }
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
            // @ts-ignore
            return await {error};
        }
    };

    return fetchContent;
};


export default buildContentFetcher;
