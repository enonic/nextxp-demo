/** Query for full data from a content item, by UUID or content path.
 *  Also available as a service: content, but there you must also supply siteId and branch as params.
 */

const portalLib = require('/lib/xp/portal');
const {getContentData} = require('../../lib/headless/contentapi/contentdata');
const {error500} = require("../../lib/headless/contentapi/errors");
const {CORS_HEADERS} = require("../../lib/headless/cors-headers");

exports.options = function () {
    return {
        contentType: 'text/plain;charset=utf-8',
        headers: CORS_HEADERS
    };
};

const handlePost = (req) => {
    try {
        /* TODO: move to front!
                idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
                maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
         */

        // query (mandatory): guillotine query to run
        // variables (mandatory if query has any placeholders): optional additional variables for a supplied query.
        const {query, variables} = JSON.parse(req.body);

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

        return getContentData(siteId, branch, query, variables);

    } catch (e) {
        return error500(e);

    }

};

exports.post = handlePost;

// FIXME: only for testing, remove.
//exports.get = handlePost;
