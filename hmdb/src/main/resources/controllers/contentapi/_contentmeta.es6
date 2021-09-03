/** Query for basic data from a content item (most importantly: content type, but auxilliary data are displayName), by UUID or content path.
 *  Also available as a service: contentmeta, but there you must also supply siteId and branch as params.
 */

const portalLib = require('/lib/xp/portal');
const {getContentMeta} = require('../../lib/headless/contentapi/contentmeta');
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
        // idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
        const {idOrPath} = JSON.parse(req.body)

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

        log.info("{branch, siteId} (" +
        	(Array.isArray({branch, siteId}) ?
        		("array[" + {branch, siteId}.length + "]") :
        		(typeof {branch, siteId} + ({branch, siteId} && typeof {branch, siteId} === 'object' ? (" with keys: " + JSON.stringify(Object.keys({branch, siteId}))) : ""))
        	) + "): " + JSON.stringify({branch, siteId}, null, 2)
        );

        return getContentMeta(siteId, branch, idOrPath);

    } catch (e) {
        return error500(e);
    }
};

exports.post = handlePost;

// FIXME: only for testing, remove.
//exports.get = handlePost;
