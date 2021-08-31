const { isValidBranch } = require('../../lib/headless/branch-context');
const guillotineLib = require('/lib/guillotine');

// const underscoredAppName = app.name.replace(/\./g, '_');

// TODO: add component data structure (from CS page-builder) into this query
const DEFAULT_BASE_QUERY = `
query($ref:ID!){
  guillotine {
    get(key:$ref) {
      _id
      displayName
      type
      ...on base_Folder {
        children(first:100) {
            _id
            displayName
            _path
        }
      }
    }
  }
};`;

const handleGet = (req) => {
    // siteId is the valid UUID for the root site.
    // idOrPath can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone
    // query and variables are optional overrides for the DEFAULT_BASE_QUERY.
    const { siteId, idOrPath, branch, query, variables } = req.params;


/* TODO: secret?
    const { secret } = req.headers;
    if (secret !== app.config.serviceSecret) {
        return {
            status: 401,
            body: {
                message: 'Invalid secret',
            },
            contentType: 'application/json',
        };
    }
*/

    if (!siteId) {
        // TODO: siteIdOrPath? Optionally make a call that fetches siteId from site _name?

        log.warn(`Missing siteId: ${JSON.stringify(siteId)}`);
        return {
            status: 400,
            body: {
                message: 'Missing siteId',
            },
            contentType: 'application/json',
        };
    }


    // TODO: from here on down, extract to a controller that can be mapped and accessed below a site, not needing the siteId param that's needed in this service
    if (branch && !isValidBranch(branch)) {
        log.warn(`Invalid branch specified: ${JSON.stringify(branch)}`);
        return {
            status: 400,
            body: {
                message: 'Invalid branch specified',
            },
            contentType: 'application/json',
        };
    }

    if (!query) {
        if (!idOrPath) {
            log.warn(`No content id or path was provided`);
            return {
                status: 400,
                body: {
                    message: 'No content id or path was provided (nor an override query or variables)',
                },
                contentType: 'application/json',
            };
        }
    }

    // TODO: which repo is targeted? Should that be overridable?
    const params = {
        siteId,
        query: query || DEFAULT_BASE_QUERY,
        variables: (!query && variables)
            ? variables
            : {
                ref: idOrPath
            }
    };
    const content = guillotineLib.execute(params);

    if (!content) {
        if (!query) {
            log.warn(`Content not found at idOrPath = ${JSON.stringify(idOrPath)}`);
        } else {
            log.warn('Content not found, at:');
            log.warn('    query: ' + query);
            if (variables) {
                log.warn('    variables: ' + variables);
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

    return {
        status: 200,
        body: content,
        contentType: 'application/json',
    };
};

exports.get = handleGet;
