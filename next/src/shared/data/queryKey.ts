const PATTERN = /\{\s*guillotine\s*\{\s*(.+?)\s*[{(]/;

const getQueryKey = (query) => {
    try {
        console.log(query);
        const mainQueryKey = query.match(PATTERN)[1];
        console.log("mainQueryKey:", mainQueryKey)
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

export default getQueryMethodKey;
