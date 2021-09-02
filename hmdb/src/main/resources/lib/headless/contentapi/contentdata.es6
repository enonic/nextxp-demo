const { branchInvalidError400, idOrPathOrQueryInvalidError400} = require("./errors");
const { executeResult } = require("./execute");

const { getContentDataQuery } = require("../guillotine/queries/fragments/contentdata");

// TODO: insert a placeholder replacement for app names as '${app}' to use in custom queries?
// const underscoredAppName = app.name.replace(/\./g, '_');



// query: HIGHLY RECOMMENDED: supply a query to replace the fallback catch-all query with a BETTER SCALING, content-type-specific one
// siteId (manatory): the valid UUID for the root site
// branch (manatory): branch to fetch from, master or draft
// idOrPath (mandatory if no override query is used): used in the default query. Can be a valid content UUID, or a (full) content path, eg. /mysite/persons/someone. Can be supplied direct param as here, or as part of the variables param (direct param has prescendence)
// variables: optional additional variables for a supplied query, or just idOrPath.
exports.getContentData = (siteId, branch, idOrPath, query, variables = {} ) => {

    // A supplied idOrPath overrides one in variables:
    if (idOrPath) {
        variables.idOrPath = idOrPath;
    }

    return branchInvalidError400(branch) ||
        idOrPathOrQueryInvalidError400(variables, query, "No query was provided (and no id or path (idOrPath) either, so the fallback query can't be used). Note that the fallback won't scale well - it's HIGHLY RECOMMENDED to add a content-type specific guillotine 'query' parameter.") ||
        executeResult(siteId, branch, query || getContentDataQuery(), variables);
};
