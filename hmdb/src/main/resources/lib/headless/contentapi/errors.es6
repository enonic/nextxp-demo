const { isValidBranch } = require("../branch-context");
const {CORS_HEADERS} = require("../cors-headers");

exports.siteIdMissing400 = (siteId) => {
    if (!siteId) {
        log.warning(`Missing siteId: ${JSON.stringify(siteId)}`);
        return {
            status: 400,
            body: {
                message: 'Missing siteId',
            },
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
    }
}

exports.branchInvalidError400 = (branch) => {
    if (branch && !isValidBranch(branch)) {
        log.warning(`Invalid branch specified: ${JSON.stringify(branch)}`);
        return {
            status: 400,
            body: {
                message: 'Invalid branch specified',
            },
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
    }
}

exports.idOrPathOrQueryInvalidError400 = (variables, query, message) => {
    if (!variables.idOrPath && !query) {
        log.warning(message);
        return {
            status: 400,
            body: {
                message,
            },
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
    }
}

exports.contentNotFoundError404 = (content, variables, query) => {

    // TODO: move to next site - it must parse the result and handle deeper 404 itself:
    /*
        // The content data on a found content will be under data.guillotine[key] - where key is determined by the query and therefore unpredictable.
        // Not-found content will still yield data.guillotine, but the value under [key] will be null.
        // So to detect content not found, look for null value under that key, or a result not on that shape.
        const output = content?.data.guillotine || {};
        const key = Object.keys(output)[0];
    */

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
            body: {
                message: 'Content not found',
            },
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
    }
}


exports.error500 = (e) => {
    log.error(JSON.stringify(e), e);
    return {
        status: 500,
        body: "There was an error. See XP server log for details.",
        contentType: 'text/plain',
        headers: CORS_HEADERS
    }
}
