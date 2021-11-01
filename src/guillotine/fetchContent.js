import enonicConnectionConfig from "../enonic-connection-config";

import META_QUERY from "../selectors/queries/_getMetaData";
import { LOW_PERFORMING_DEFAULT_QUERY } from "../selectors/queries/_getDefaultData";

import typeSelector from "../selectors/typeSelector";



///////////////////////////////////////////////////////////////////////////////// Data fetching

/** Generic fetch */
const fetchFromApi = async (apiUrl, body, method = "POST") => {
    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    };

    let res;
    try {
        res = await fetch(apiUrl, options);
    } catch (e) {
        console.warn(apiUrl, e);
        throw new Error(JSON.stringify({
            code: "API",
            message: e.message
        }));
    }

    if (!res.ok) {
        throw new Error(JSON.stringify({
            code: res.status,
            message: `Data fetching failed (message: '${await res.text()}')`
        }));
    }

    let json;
    try {
        json = await res.json();
    } catch (e) {
        throw new Error(JSON.stringify({
            code: 500,
            message: `API call completed but with non-JSON data: ${JSON.stringify(await res.text())}`
        }));
    }

    if (!json) {
        throw new Error(JSON.stringify({
            code: 500,
            message: `API call completed but with unexpectedly empty data: ${JSON.stringify(await res.text())}`
        }));
    }

    return json;
};



/** Guillotine-specialized fetch, using the generic fetch above */
const fetchGuillotine = async (contentApiUrl, body, key, xpContentPath, requiredMethodKeyFromQuery) => {
    if (typeof body.query !== 'string' || !body.query.trim()) {
        return await {
            error: {
                code: 400,
                message: `Invalid or missing query. JSON.stringify(query) = ${JSON.stringify(body.query)}`
            }
        };
    }

    const result = await fetchFromApi(
        contentApiUrl,
        body
    )
        .then(json => {
            let errors = (json || {}).errors;

            if (errors) {
                if (!Array.isArray(errors)) {
                    errors = [errors];
                }
                console.warn(`${errors.length} error(s) when trying to fetch data (path = ${JSON.stringify(xpContentPath)}):`);
                errors.forEach(error => {
                    console.error(error);
                });
                console.warn(`Query:\n${body.query}`);
                console.warn(`Variables: ${JSON.stringify(body.variables, null, 2)}`);

                return {
                    error: {
                        code: 500,
                        message: `Server responded with ${errors.length} error(s), probably from guillotine - see log.`
                    }
                };
            }

            const guillotineData = ((json || {}).data || {}).guillotine || {};
            if (Object.keys(guillotineData).length === 0) {
                console.warn(`Empty/unexpected data from guillotine API (path = ${JSON.stringify(xpContentPath)}).\nResponse:\n`, json);
                return {error: {code: 404, message: "Content not found"}};
            }
            if (requiredMethodKeyFromQuery && !guillotineData[requiredMethodKeyFromQuery]) {
                console.warn(`Empty/unexpected data from guillotine API (path = ${JSON.stringify(xpContentPath)}).\nResponse:\n`, json);
                return {error: {code: 404, message: "Content not found"}};
            }

            const data = requiredMethodKeyFromQuery
                ? json.data.guillotine[requiredMethodKeyFromQuery]
                : json.data.guillotine;

            return {
                [key]: data
            };

        })
        .catch((err) => {
            console.warn(`Client-side error when trying to fetch data (path = ${JSON.stringify(xpContentPath)})`, err);
            try {
                return {error: JSON.parse(err.message)};
            } catch (e2) {
                return {error: {code: "Client-side error", message: err.message}}
            }
        });

    return result;
};








///////////////////////////////////////////////////////////////////////////////// Guillotine result unpacking

const PATTERN = /\{\s*guillotine\s*\{\s*(.+?)\s*[{(]/;

const getQueryKey = (query) => {
    try {
        const mainQueryKey = query.match(PATTERN)[1];
        if (!mainQueryKey) {
            throw Error("Regex match group 1 is empty.")
        }
        return mainQueryKey;
    } catch (e) {
        console.warn(e);
        throw Error("Couldn't extract main query key from query string:" + query);
    }
}

const queryMethodKeyCache = {};

const getQueryMethodKey = (contentType, query) => {
    let methodKeyFromQuery = queryMethodKeyCache[contentType];
    if (!methodKeyFromQuery) {
        methodKeyFromQuery = getQueryKey(query);
        if (methodKeyFromQuery) {
            queryMethodKeyCache[contentType] = methodKeyFromQuery;
        }
    }
    return methodKeyFromQuery;
}



///////////////////////////////////////////////////////////////////////////////// No-op

const NO_PROPS_PROCESSOR = (props) => props;



///////////////////////////////////////////////////////////////////////////////// Specific fetch wrappers:

const fetchMetaData = async (contentApiUrl, xpContentPath) => {
    const body = {
        query: META_QUERY,
        variables: {
            path: xpContentPath
        }
    };
    return await fetchGuillotine(contentApiUrl, body, 'meta', xpContentPath, 'get');
}



const fetchContentData = async (
    contentApiUrl,
    xpContentPath,
    query,
    methodKeyFromQuery,
    variables
) => {
    const body = {query};
    if (variables && Object.keys(variables).length > 0) {
        body.variables = variables;
    }
    return await fetchGuillotine(contentApiUrl, body, 'content', xpContentPath, methodKeyFromQuery);
};





///////////////////////////////////////////////////////////////////////////////// Error checking:

/** Checks a site-relative contentPath as a slash-delimited string or a string array, and returns a pure site-relative path string (no double slashes, starts with a slash, does not end with one). */
const getCleanContentPathArrayOrThrow400 = (contentPath) => {
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
        return (contentPath).join('/');
    }
}





///////////////////////////////////////////////////////////////////////////////// fetchContent setup


/**
 * firstMethodKey (boolean) switches on or off functionality that detects the first method in the query (and if used, the assumption is: there is only one method in ALL existing queries), and unpacks the data from below that key.
 *          - firstMethodKey=true: can simplify usage a bit, but ONLY use if all query strings use only one guillotine method call - no queries have more than one (eg. 'get' in the query string 'query($path:ID!){ guillotine { get(key:$path) { type }}}'). The (first) guillotine method call is autodetected from each query string ('get', 'getChildren', 'query' etc), and that string is used in two ways. The response under that key is checked for non-null content (returns 404 error if null), and the returned content is the object below that method-named key (which in turn is under the 'guillotine' key in the response from the guillotine API (in this example: the value of reponseData.guillotine['get']).
 *          - firstMethodKey=false: this disables the autodetection, a 404 error is only returned if no (or empty) object under the 'guillotine' key was found. Otherwise, the entire data object under 'guillotine' is returned, with all method-named keys from the query - not just the data under the method-named key from the query.
 */
const firstMethodKey = true;

// enonicConnectionConfig is the imported object from enonic-connecion-config.js: important attributes are the method getXpPath, and the string contentApiUrl.
const { contentApiUrl, getXpPath } = enonicConnectionConfig;

const defaultGetVariables = (path) => ({ path });




const getQueryAndVariables = (type, path, context, selectedQuery) => {
    let query, getVariables = null;
    if (!selectedQuery) {
        query = LOW_PERFORMING_DEFAULT_QUERY;

    } else if (typeof selectedQuery === 'string') {
        query = selectedQuery;

    } else if (Array.isArray(selectedQuery)) {
        query = selectedQuery[0];
        getVariables = selectedQuery[1];

    } else if (typeof selectedQuery === 'object') {
        query = selectedQuery.query;
        getVariables = selectedQuery.variables;
    }

    if (typeof query !== 'string') {
        throw Error(`Selected query for content type ${type} should be a query string, not: ${typeof query}`);
    }
    if (!getVariables) {
        getVariables = defaultGetVariables;
    } else if (typeof getVariables !== 'function') {
        throw Error(`Selected query for content type ${type} should be a getVariables function, not: ${typeof getVariables}`);
    }

    // Default query and variables if no content-type-specific query was found for the type
    if (!query) {
        console.warn(`${JSON.stringify(path)}: no query has been assigned for the content type ${JSON.stringify(type)}.\n\nThe default data query (_getDefaultData.ts) will be used, but note that this is a development tool and won't scale well in production. It's HIGHLY RECOMMENDED to write a content-type-specialized guillotine query, and add that to querySelector in querySelector.ts!`);
        query = LOW_PERFORMING_DEFAULT_QUERY;
        getVariables = defaultGetVariables;
    }

    return {
        query,
        variables: getVariables(path, context)
    }
};







/////////////////////////////////////////////////////// ENTRY: FETCHER FUNCTION

/** Runs custom content-type-specific guillotine calls against an XP guillotine endpoint, returns content data, error and some meta data
 * Sends one query to the guillotine API and asks for content type, then uses the type to select a second query and variables, which is sent to the API and fetches content data.
 * @param contentPath string or string array: pre-split or slash-delimited _path to a content available on the API
 * @param context Context object from Next, contains .query info
 * @returns ContentResult object: {data?: T, meta: {path, type}, error?: {code, message}}
 */
export const fetchContent = async (contentPath, context) => {

    try {
        const siteRelativeContentPath = getCleanContentPathArrayOrThrow400(contentPath);
        const xpContentPath = getXpPath(siteRelativeContentPath);




        //////////// FIRST GUILLOTINE CALL FOR METADATA - MAINLY XP CONTENT TYPE:
        const metaResult = await fetchMetaData(contentApiUrl, xpContentPath);
        ///////////




        if (metaResult.error) {
            return await {
                error: metaResult.error
            };
        }

        const { type } = metaResult.meta || {};

        if (!type) {
            return await {
                error: {
                    code: 500,
                    message: "Server responded with incomplete meta data: missing content 'type' attribute."
                }
            }
        }




        //////////////  Content type established. Proceed to data call:

        // typeSelector is an object imported from typeSelector.ts, more info there.
        // Keys are full XP content type strings (eg. 'my.app:content-type') and values are optional type-specific objects of config for how to handle that function.
        const typeSelection = (typeSelector || {})[type];

        const {query, variables} = getQueryAndVariables(type, xpContentPath, context, typeSelection?.query);
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




        //////////// SECOND GUILLOTINE CALL FOR DATA:
        const guillotineResponse = await fetchContentData(contentApiUrl, xpContentPath, query, methodKeyFromQuery, variables);
        //////////////////




        if (guillotineResponse.content) {
            const propsProcessor = typeSelection?.props || NO_PROPS_PROCESSOR;
            guillotineResponse.content = propsProcessor(guillotineResponse.content, context);
        }

        const response = await {
            ...guillotineResponse,
            meta: {
                path: siteRelativeContentPath,
                type
            }
        };

        return response;





    //////////////  Catch

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
