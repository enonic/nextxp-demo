const { getContentBase } = require('../../lib/headless/contentapi/contentbase');

const handleGet = (req) => {
    // siteId (manatory): the valid UUID for the root site
    // branch (manatory): branch to fetch from, master or draft
    // idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
    // variables: optional additional variables for a supplied query, or just idOrPath.
    // query: optional override for the DEFAULT_BASE_QUERY.
    // maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
    const {idOrPath, branch, siteId, query, variables, maxChildren} = req.params;

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

        log.warning(`Missing siteId: ${JSON.stringify(siteId)}`);
        return {
            status: 400,
            body: {
                message: 'Missing siteId',
            },
            contentType: 'application/json',
        };
    }

    return getContentBase(siteId, branch, idOrPath, query, variables, maxChildren);
};

exports.get = handleGet;
