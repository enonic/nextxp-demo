/** Query for basic data from a content item (most importantly: content type, but auxilliary data are displayName), by UUID or content path.
 *  Also available as a service: contentbase, but there you must also supply siteId and branch as params.
 */

const portalLib = require('/lib/xp/portal');
const {getContentBase} = require('../../lib/headless/contentapi/contentbase');
const {error500} = require("../../lib/headless/contentapi/errors");
const {CORS_HEADERS} = require("../../lib/headless/cors-headers");

log.info("CORS_HEADERS (" +
    (Array.isArray(CORS_HEADERS) ?
            ("array[" + CORS_HEADERS.length + "]") :
            (typeof CORS_HEADERS + (CORS_HEADERS && typeof CORS_HEADERS === 'object' ? (" with keys: " + JSON.stringify(Object.keys(CORS_HEADERS))) : ""))
    ) + "): " + JSON.stringify(CORS_HEADERS, null, 2)
);

exports.options = function () {
    return {
        contentType: 'text/plain;charset=utf-8',
        headers: CORS_HEADERS
    };
};

const handlePost = (req) => {
    try {

        // idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
        // variables: optional additional variables for a supplied query, or just idOrPath.
        // query: optional override for the DEFAULT_BASE_QUERY.
        // maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
        const {idOrPath, query, variables, maxChildren} = req.params;

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

        return getContentBase(siteId, branch, idOrPath, query, variables, maxChildren);

    } catch (e) {
        return error500(e);
    }
};

exports.post = handlePost;

// FIXME: only for testing, remove.
//exports.get = handlePost;
