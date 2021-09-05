const { branchInvalidError400, queryInvalidError400} = require("./errors");
const { executeResult } = require("./execute");



    /* TODO: move to front!
            idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
            maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
     */

// siteId (mandatory, must be previously checked since that's not done here!): the valid UUID for the root site.
// branch (manatory): branch to fetch from: master or draft
// query (mandatory): guillotine query to run
// variables (mandatory if query has any placeholders): optional additional variables for a supplied query.
exports.getContentData = (siteId, branch, query, variables = {}) =>
    branchInvalidError400(branch) ||
    queryInvalidError400(query) ||
    executeResult(siteId, branch, query, variables);

