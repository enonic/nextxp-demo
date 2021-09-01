const {branchInvalidError400, idOrPathOrQueryInvalidError400} = require("./validation");
const { executeResult } = require("./execute");

const { getContentBaseQuery } = require('../guillotine/queries/fragments/contentbase');


// TODO: insert a placeholder replacement for app names as '${app}' to use in custom queries?
// const underscoredAppName = app.name.replace(/\./g, '_');


// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
// variables: optional additional variables for a supplied query, or just idOrPath.
// query: optional override for the DEFAULT_BASE_QUERY.
// maxChildren: set max number of children to list below folders. 0 turns off the search for children. Default is 1000.
exports.getContentBase = (siteId, branch, idOrPath, query, variables = {}, maxChildren) => {

    // Supplied idOrPath overrides it in variables:
    if (idOrPath) {
        variables.idOrPath = idOrPath;
    }

    // Supplied maxchildren overrides it in variables, and selects a search-children query if above 0
    const mxCh = parseInt(maxChildren)
    if (!isNaN(mxCh)) {
        variables.maxChildren = mxCh;
    }

    if (typeof variables.maxChildren === 'undefined') {
        variables.maxChildren = 1000;
    }

    return branchInvalidError400(branch) ||
        idOrPathOrQueryInvalidError400(variables, query, 'No query was provided, and no id or path (iOrPath)') ||
        executeResult(siteId, branch, query || getContentBaseQuery(variables.maxChildren), variables);
};
