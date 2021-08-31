const { isValidBranch } = require('../../lib/headless/branch-context');
const guillotineLib = require('/lib/guillotine');

const underscoredAppName = app.name.replace(/\./g, '_');

const DEFAULT_BASE_QUERY = `
query($ref:ID!){
  guillotine {
    get(key:$ref) {
      _id
      displayName
      type
      dataAsJson
    }
  }
};`;

const handlePost = (req) => {
    // idOrPath can be a content UUID, or a content path, ie. /www.nav.no/no/person
    // query and variables are overrides for the DEFAULT_BASE_QUERY.

    const { siteId, branch, query, variables, idOrPath } = req.params;

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
        if (idOrPath) {
            log.warn(`No query was provided, a catch-all fallback query for the idOrPath ${JSON.stringify(idOrPath)} will be used. This won't scale well, it's highly recommended to supply a specific guillotine query for your content!`);
        } else {
            log.warn(`No query was provided - and no idOrPath either (${JSON.stringify(idOrPath)}), so the fallback query can't be used. Note that the fallback won't scale well, so it's better to supply a specific guillotine query for your content anyway!`);
            return {
                status: 400,
                body: {
                    message: 'No query was provided, and no idOrPath.',
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

exports.post = handlePost;
