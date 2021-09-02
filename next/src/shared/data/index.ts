import {contentApiUrlGetters} from "../../enonic-connection-config";

// Shape of content base-data API body
type ContentApiBaseBody = {
    idOrPath: string,           // Full content item _path
    maxChildren?: number,       // On the default query, can set between 0 and 1000 to limit or disable the children below folder content items
    query?: string,             // Override the default base-data query
    variables?: {},         // GraphQL variables inserted into the query

    // Not needed when the API is a mapped controller below a site, as is default here. But needed if using the service API:
    branch?: string,            // master or draft.
    siteId?: string             // UUID for the site to fetch content below.
};


const fetchFromApi = async <T>(
    apiUrl: string,
    body: {},
    method = "POST"
): Promise<T> => {
    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    };

    return await fetch(apiUrl, options)
        .then(async (res: Response) => {
            if (!res.ok) {
                throw new Error(JSON.stringify({
                    code: res.status,
                    message: `Data fetching failed (message: '${res.statusText}')`
                }));
            }
            return (await res.json());
        })
        .then(async (json) => {
            if (!json) {
                throw new Error(JSON.stringify({
                    code: 404,
                    message: `API call completed but with empty data: ${JSON.stringify(json)}`
                }));
            }
            return json as T;
        });
};


export const fetchContent = async (apiUrl, body, key, methodKeyFromQuery = 'get') => {
    const result = await fetchFromApi(
        apiUrl,
        body
    )
        .then(json => {
            if (!(((json || {}).data || {}).guillotine || {})[methodKeyFromQuery]) {
                console.error('404 - not found.\nResponse from _contentMeta API:\n', json);
                return {error: {code: 404, message: "Not found"}};
            }

            return {
                [key]: json.data.guillotine[methodKeyFromQuery]
            };
        })
        .catch((err) => {
            console.error(err);
            try {
                return {error: JSON.parse(err.message)};
            } catch (e2) {
                return {error: {code: "Local error", message: err.message}}
            }
        });

    // console.log("fetchContent result:", result);

    return result;
};






/////////////////////////////////////////////////////////////////////////////////////


// TODO: Handle graphql variables / placeholders any more than this?

// TODO: this should be placed somewhere better.

// Content types mapped to full guillotine query strings. If type is not found here, the API has a LOW-PERFORMING default query.
const contentTypeSpecificQueries = {
    // "my.example.app:content-type": "{ guillotine { get { query string } } }"
};


type ContentResult = {
    error?: {},
    content?: {}
};

export const fetchData = async (branch: string, contentPath: string[]): Promise<ContentResult> => {
    // TODO: Handle bad / insufficient contentPath (return a 400)

    const idOrPath = "/" + contentPath
        .filter(p => !!(p || '').trim())    // Remove empty items
        .join("/");
    const appName = contentPath[0];

    const metaResult = await fetchContentMeta(branch, appName, idOrPath);

    if (metaResult.error) {
        return {
            error: metaResult.error
        };
    }

    const { type /*, displayName, _id, _path*/ } = metaResult.contentMeta || {};
    if (!type) {
        return {
            error: {
                code: 500,
                message: "Server responded with incomplete meta data: missing content 'type' attribute."
            }
        }
    }

    // TODO: The above can be cached by path on status 200, invalidated on that path on other status.

    const overrideQuery = contentTypeSpecificQueries[type];

    // TODO: what about variables?
    const contentResult = await fetchContentFull(branch, appName, idOrPath, overrideQuery);

    // TODO: On 200, verify that contentData.content.type is equal to type above (from content-meta). If not, or on other status, invalidate that path in the cache above.

    console.log("content: ", contentResult);

    return contentResult;
}




const fetchContentMeta = async (branch: string, appName: string, idOrPath: string): Promise<{error?: {}, contentMeta?: {}}> => {

    const getContentMetaUrl = contentApiUrlGetters[branch].getMetaUrl;
    const contentMetaUrl = getContentMetaUrl(appName);

    // TODO: other things to wrap into the body: query (override), variables, remember to pass the key from the query into fetchContent below as methodKeyFromQuery
    const body: ContentApiBaseBody = {idOrPath};

    return await fetchContent(contentMetaUrl, body, 'contentMeta');
};




const fetchContentFull = async (branch: string, appName: string, idOrPath: string, query?: string, variables?: {}): Promise<ContentResult> => {

    const getContentUrl = contentApiUrlGetters[branch].getContentUrl;
    const contentUrl = getContentUrl(appName);

    // TODO: When passing in override query, remember to also pass the key from the query into fetchContent (methodKeyFromQuery), eg. 'get', 'query', 'getChildren' etc
    const body: ContentApiBaseBody = {idOrPath};
    if (query) {
        body.query = query;
    }
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }

    return await fetchContent(contentUrl, body, 'content');
};
