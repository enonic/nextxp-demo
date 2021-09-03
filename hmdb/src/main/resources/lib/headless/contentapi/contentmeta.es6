const { branchInvalidError400, idOrPathInvalidError400 } = require("./errors");
const { executeResult } = require("./execute");

const { META_QUERY } = require('../guillotine/queries/_meta');

// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the _meta query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone.
exports.getContentMeta = (siteId, branch, idOrPath) => {

    log.info("META_QUERY (" +
    	(Array.isArray(META_QUERY) ?
    		("array[" + META_QUERY.length + "]") :
    		(typeof META_QUERY + (META_QUERY && typeof META_QUERY === 'object' ? (" with keys: " + JSON.stringify(Object.keys(META_QUERY))) : ""))
    	) + "): " + JSON.stringify(META_QUERY, null, 2)
    );

    return branchInvalidError400(branch) ||
        idOrPathInvalidError400(idOrPath) ||
        executeResult(siteId, branch, META_QUERY, { idOrPath });
};
