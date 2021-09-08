import {getGuillotineUrlDraft, getGuillotineUrlMaster} from "../../enonic-connection-config";

import {fetchGuillotine} from "./data";

import getQueryAndVariables from "./querySelector";
import getQueryMethodKey from './queryKey';

import META_QUERY, {Meta} from "./queries/_getMetaData";

// Shape of content base-data API body
type ContentApiBaseBody = {
    query?: string,                 // Override the default base-data query
    variables?: {                   // GraphQL variables inserted into the query
        idOrPath?: string,           // Full content item _path.
        maxChildren?: number,       // On the default query, can set between 0 and 1000 to limit or disable the children below folder content items.
                                    // ...add other variables depending on placeholders in custom query
    },

    // Not needed when the API is a mapped controller below a site, as is default here. But needed if using the service API:
    branch?: string,                // master or draft.
    siteId?: string                 // UUID for the site to fetch content below.
};

type Result = {
    error?: {
        code: string,
        message: string
    }
}
type ContentResult<T> = Result & {
    content?: T
};
type MetaResult = Result & {
    meta?: Meta
};

type Branch = 'master' | 'draft';




///////////////////////////////////////////////////////////////////////////////// Specific fetch:

const fetchMetaData = async (contentUrl: string, idOrPath: string): Promise<MetaResult> => {
    const body: ContentApiBaseBody = {
        query: META_QUERY,
        variables: {
            idOrPath
        }
    };
    return await fetchGuillotine<MetaResult>(contentUrl, body, 'meta', idOrPath, 'get');
}



const fetchContentFull = async <T>(
    contentUrl: string,
    /* branch: string, appName: string, */
    idOrPath: string,
    query: string,
    methodKeyFromQuery: string,
    variables?: {}): Promise<ContentResult<T>> => {

    // TODO: When passing in override query, remember to also pass the key from the query into fetchGuillotine (methodKeyFromQuery), eg. 'get', 'query', 'getChildren' etc
    const body: ContentApiBaseBody = {query};
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }
    return await fetchGuillotine<ContentResult<T>>(contentUrl, body, 'content', idOrPath, methodKeyFromQuery);
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

const contentUrlGetters = {
    draft: getGuillotineUrlDraft,
    master: getGuillotineUrlMaster
}

export const fetchContent = async <T>(contentPath: string | string[], branch: Branch): Promise<ContentResult<T>> => {
    try {


        verifyBranchOrError400(branch);
        const contentPathArray = getCleanContentPathArrayOrError400(contentPath);

        const idOrPath = "/" + contentPathArray.join("/");

        // The first item is interpreted to be the _name of the app.
        const appName = contentPathArray[0];
        const getContentUrl = contentUrlGetters[branch];
        const contentUrl = getContentUrl(appName);

        const metaResult = await fetchMetaData(contentUrl, idOrPath);

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

        const {query, variables} = getQueryAndVariables(type, idOrPath);
        // checkQuery400
        const methodKeyFromQuery = getQueryMethodKey(type, query);
        const contentResult = await fetchContentFull(contentUrl, idOrPath, query, methodKeyFromQuery, variables);

        // TODO: On 200, verify that contentData.content.type is equal to type above (from content-meta). If not, or on other status, invalidate that path in the cache above.


        return contentResult;

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
        return await { error };
    }
}


