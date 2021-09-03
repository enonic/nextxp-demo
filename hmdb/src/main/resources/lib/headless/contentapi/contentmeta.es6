const { branchInvalidError400, idOrPathOrQueryInvalidError400 } = require("./errors");
const { executeResult } = require("./execute");

const { DEFAULT_META_QUERY } = require('../guillotine/queries/fragments/contentmeta');


// TODO: insert a placeholder replacement for app names as '${app}' to use in custom queries?
// const underscoredAppName = app.name.replace(/\./g, '_');


// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
// variables: optional additional variables for a supplied query, or just idOrPath.
// query: optional override for the DEFAULT_BASE_QUERY.
exports.getContentMeta = (siteId, branch, idOrPath, query, variables = {}) => {

    // Supplied idOrPath overrides it in variables:
    if (idOrPath) {
        variables.idOrPath = idOrPath;
    }

    return branchInvalidError400(branch) ||
        idOrPathOrQueryInvalidError400(variables, query, 'No query was provided, and no id or path (idOrPath)') ||
        executeResult(siteId, branch, query || query || DEFAULT_META_QUERY, variables);
};
