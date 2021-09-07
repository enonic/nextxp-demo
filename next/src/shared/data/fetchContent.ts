import {contentApiUrlGetters} from "../../enonic-connection-config";

import {fetchGuillotine} from "./data";

import getQueryAndVariables from "./querySelector";
import getQueryMethodKey from './queryKey';

import META_QUERY, { Meta } from "./queries/_getMetaData";


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
    error?: {}
}
type ContentResult<T> = Result & {
    content?: T
};
type MetaResult = Result & {
    meta?: Meta
};

export const fetchContent = async<T> (contentPath: string | string[], getContentUrl:Function): Promise<ContentResult<T>> => {
    // TODO: Handle bad / insufficient contentPath (return a 400)

    const idOrPath = "/" + contentPath
        .filter(p => !!(p || '').trim())    // Remove empty items
        .join("/");

    // idOrPathInvalidError400(idOrPath) ||
    // branchInvalid400(branch)


    const appName = contentPath[0];

    const contentUrl = getContentUrl(appName);

    const metaResult = await fetchMeta(contentUrl, idOrPath);

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
        return {
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
}


/////////////////////////////////////////////////////////////////////////////////////// Fetch-wrappers for the two calls

/*
const fetchMeta = async (branch: string, appName: string, idOrPath: string): Promise<{error?: {}, contentMeta?: {}}> => {

    const getContentMetaUrl = contentApiUrlGetters[branch].getMetaUrl;
    const contentMetaUrl = getContentMetaUrl(appName);

    // TODO: other things to wrap into the body: query (override), variables, remember to pass the key from the query into fetchGuillotine below as methodKeyFromQuery
    const body: ContentApiBaseBody = {idOrPath};

    return await fetchGuillotine(contentMetaUrl, body, 'contentMeta');
};
*/


const fetchMeta = async (contentUrl: string, /* branch: string, appName: string, */ idOrPath: string): Promise<MetaResult> => {
    const body: ContentApiBaseBody = {
        query: META_QUERY,
        variables: {
            idOrPath
        }
    };
    return await fetchGuillotine<MetaResult>(contentUrl, body, 'meta', idOrPath, 'get');


    // contentNotFoundError404(content, variables, query) ||

}


///////////////////////////////////////////////////



const fetchContentFull = async<T> (
    contentUrl: string,
    /* branch: string, appName: string, */
    idOrPath: string,
    query: string,
    methodKeyFromQuery: string,
    variables?: {} ): Promise<ContentResult<T>> => {

    // queryInvalidError400(query) ||

    // TODO: When passing in override query, remember to also pass the key from the query into fetchGuillotine (methodKeyFromQuery), eg. 'get', 'query', 'getChildren' etc
    const body: ContentApiBaseBody = { query };
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }
    return await fetchGuillotine<ContentResult<T>>(contentUrl, body, 'content', idOrPath, methodKeyFromQuery);

    // contentNotFoundError404(content, variables, query) ||

    //     } catch (e) {
    //         return error500(e);
    //     }
};


/*
contentNotFoundError404 = (content, variables, query) => {
    if (!content) {
        if (!query) {
            log.warning(`Content not found at idOrPath = ${JSON.stringify(variables.idOrPath)}`);
        } else {
            log.warning('Content not found, at:');
            log.warning('    query: ' + query);
            if (variables) {
                log.warning('    variables: ' + JSON.stringify(variables));
            }
        }

        return {
            status: 404,
            body: 'Content not found',
            contentType: 'text/plain',
            headers: CORS_HEADERS
        };
    }
}
 */
