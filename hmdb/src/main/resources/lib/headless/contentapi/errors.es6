const { isValidBranch } = require("../branch-context");
const {CORS_HEADERS} = require("../cors-headers");

const logAndGetError400 = (message, value) => {
    log.warning(`${message}: ${JSON.stringify(value)}`);
    return {
        status: 400,
        body: message,
        contentType: 'text/plain',
        headers: CORS_HEADERS
    };
};

exports.siteIdMissingError400 = (siteId) => {
    if (!siteId) {
        return logAndGetError400('Missing siteId param', siteId);
    }
}

exports.branchInvalidError400 = (branch) => {
    if (branch && !isValidBranch(branch)) {
        return logAndGetError400("Invalid branch param specified (expected 'master' or 'draft')", branch);
    }
}

exports.queryInvalidError400 = (query) => {
    if (!query) {
        return logAndGetError400('Missing query param', query);
    }
}

exports.idOrPathInvalidError400 = (idOrPath) => {
    if (!idOrPath) {
        return logAndGetError400('Id or path is missing (idOrPath param)', idOrPath);
    }
}

exports.contentNotFoundError404 = (content, variables, query) => {
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


exports.error500 = (e) => {
    log.error(e);
    return {
        status: 500,
        body: "There was an error. See XP server log for details.",
        contentType: 'text/plain',
        headers: CORS_HEADERS
    };
}
