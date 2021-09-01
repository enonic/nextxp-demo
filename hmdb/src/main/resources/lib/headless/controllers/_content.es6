const portalLib = require('/lib/xp/portal');
const { getContentData } = require('../contentapi/contentdata');

const handlePost = (req) => {
    // query: HIGHLY RECOMMENDED: supply a query to override the fallback catch-all query with a BETTER SCALING, content-type-specific one.
    // idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
    // variables: optional additional variables for a supplied query, or just idOrPath.
    const {query, idOrPath, variables} = req.params;

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

    return getContentData(siteId, branch, idOrPath, query, variables);
};

exports.post = handlePost;
