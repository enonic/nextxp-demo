const {branchInvalidError400, idOrPathOrQueryInvalidError400} = require("./validation");
const { executeResult } = require("./execute");

const { DEFAULT_BASE_QUERY } = require('../guillotine/queries/fragments/contentbase');


// TODO: insert a placeholder for app names ag '${app}' to use in custom queries?
// const underscoredAppName = app.name.replace(/\./g, '_');


// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
// variables: optional additional variables for a supplied query, or just idOrPath.
// query: optional override for the DEFAULT_BASE_QUERY.
exports.getContentBase = (siteId, branch, idOrPath, query, variables = {}) => {

    // A supplied idOrPath overrides one in variables:
    if (idOrPath) {
        variables.idOrPath = idOrPath;
    }

    return branchInvalidError400(branch) ||
        idOrPathOrQueryInvalidError400(variables, query, 'No query was provided, and no id or path (iOrPath)') ||
        executeResult(siteId, branch, query || DEFAULT_BASE_QUERY, variables);
};
