/** Query for full data from a content item, by UUID or content path.
 *  Also available as a mapped controller: <site>/_content, which doesn't need siteId or branch.
 */

const { getContentData } = require('../../lib/headless/contentapi/contentdata');
const { error500, siteIdMissingError400 } = require("../../lib/headless/contentapi/errors");

const handlePost = (req) => {
    try {
        /* TODO: move to front!
                query: HIGHLY RECOMMENDED: supply a query to replace the fallback catch-all query with a BETTER SCALING, content-type-specific one
                idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
                variables: optional additional variables for a supplied query, or just idOrPath.
                maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
                TODO: siteIdOrPath? Optionally make a call that fetches siteId from site _name?
         */

        // siteId (manatory): the valid UUID for the root site
        // branch (manatory): branch to fetch from, master or draft
        // query (mandatory): guillotine query to run
        // variables (mandatory if query has any placeholders): optional additional variables for a supplied query.
        const {siteId, branch, query, variables} = JSON.parse(req.body)

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


        return siteIdMissingError400(siteId) ||
            getContentData(siteId, branch, query, variables);

    } catch (e) {
        return error500(e);
    }
};

exports.post = handlePost;
