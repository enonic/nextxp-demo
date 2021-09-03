import {contentApiUrlGetters} from "../../enonic-connection-config";
import {fetchGuillotine} from "./data";
import getQueryAndVariables from "./querySelector";




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




type ContentResult = {
    error?: {},
    content?: {}
};

export const fetchContent = async (branch: string, contentPath: string[]): Promise<ContentResult> => {
    // TODO: Handle bad / insufficient contentPath (return a 400)

    const idOrPath = "/" + contentPath
        .filter(p => !!(p || '').trim())    // Remove empty items
        .join("/");
    const appName = contentPath[0];

    const metaResult = await fetchMeta(branch, appName, idOrPath);

    if (metaResult.error) {
        return {
            error: metaResult.error
        };
    }

    const {
        type
        // , displayName, _id, _path if using RICH_META_QUERY in hmdb/src/main/resources/lib/headless/guillotine/queries/_meta.es6
    } = metaResult.contentMeta || {};

    if (!type) {
        return {
            error: {
                code: 500,
                message: "Server responded with incomplete meta data: missing content 'type' attribute."
            }
        }
    }

    const {query, variables} = getQueryAndVariables(type, idOrPath);

    const contentResult = await fetchContentFull(branch, appName, query, variables);

    // TODO: On 200, verify that contentData.content.type is equal to type above (from content-meta). If not, or on other status, invalidate that path in the cache above.

    console.log("content: ", contentResult);

    return contentResult;
}


/////////////////////////////////////////////////////////////////////////////////////// Fetch-wrappers for the two calls


const fetchMeta = async (branch: string, appName: string, idOrPath: string): Promise<{error?: {}, contentMeta?: {}}> => {

    const getContentMetaUrl = contentApiUrlGetters[branch].getMetaUrl;
    const contentMetaUrl = getContentMetaUrl(appName);

    // TODO: other things to wrap into the body: query (override), variables, remember to pass the key from the query into fetchGuillotine below as methodKeyFromQuery
    const body: ContentApiBaseBody = {idOrPath};

    return await fetchGuillotine(contentMetaUrl, body, 'contentMeta');
};




const fetchContentFull = async (branch: string, appName: string, query: string, variables?: {}): Promise<ContentResult> => {

    const getContentUrl = contentApiUrlGetters[branch].getContentUrl;
    const contentUrl = getContentUrl(appName);

    // TODO: When passing in override query, remember to also pass the key from the query into fetchGuillotine (methodKeyFromQuery), eg. 'get', 'query', 'getChildren' etc
    const body: ContentApiBaseBody = { query };
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }

    return await fetchGuillotine(contentUrl, body, 'content');
};
