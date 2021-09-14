const PATTERN = /\{\s*guillotine\s*\{\s*(.+?)\s*[{(]/;

const getQueryKey = (query: string): string => {
    try {
        // @ts-ignore
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

const queryMethodKeyCache: {[key: string]: string} = {};

const getQueryMethodKey = (contentType: string, query: string) => {
    let methodKeyFromQuery: string = queryMethodKeyCache[contentType];
    if (!methodKeyFromQuery) {
        methodKeyFromQuery = getQueryKey(query);
        if (methodKeyFromQuery) {
            queryMethodKeyCache[contentType] = methodKeyFromQuery;
        }
    }
    return methodKeyFromQuery;
}

export default getQueryMethodKey;
