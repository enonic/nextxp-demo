const portalLib = require('/lib/xp/portal');
const { getContentBase } = require('../contentapi/contentbase');

const handleGet = (req) => {
    // idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
    // variables: optional additional variables for a supplied query, or just idOrPath.
    // query: optional override for the DEFAULT_BASE_QUERY.
    const { idOrPath, query, variables } = req.params;

    var branch = req.branch;
    var siteId = portalLib.getSite()._id;

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

    return getContentBase(siteId, branch, idOrPath, query, variables);
};

exports.get = handleGet;
