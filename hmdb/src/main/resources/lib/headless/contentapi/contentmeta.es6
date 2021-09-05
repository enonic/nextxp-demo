const {branchInvalidError400, idOrPathInvalidError400} = require("./errors");
const {executeResult} = require("./execute");

const {META_QUERY} = require('../guillotine/queries/_meta');

// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the _meta query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone.
exports.getContentMeta = (siteId, branch, idOrPath) =>
    branchInvalidError400(branch) ||
    idOrPathInvalidError400(idOrPath) ||
    executeResult(siteId, branch, META_QUERY, {idOrPath});
