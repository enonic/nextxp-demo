const { isValidBranch } = require("../branch-context");

exports.branchInvalidError400 = (branch) => {
    if (branch && !isValidBranch(branch)) {
        log.warning(`Invalid branch specified: ${JSON.stringify(branch)}`);
        return {
            status: 400,
            body: {
                message: 'Invalid branch specified',
            },
            contentType: 'application/json',
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
        };
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
            body: {
                message: 'Content not found',
            },
            contentType: 'application/json',
        };
    }
}
