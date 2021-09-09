import { appKey } from '../enonic-connection-config';

// EXAMPLE:
// import MY_IMPORTED_QUERY from '../shared/data/queries/getMyContentType';

// XP content types ('type' from the first meta response in fetchContent.ts) mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from _getDefaultData.ts!
export const querySelector = {

    // EXAMPLES:
    // 'my.harcoded.appname:my-content-type': '{ guillotine { get { hardcoded custom query string etc } } }'
    // [`${appKey}:my-content-type`]: MY_IMPORTED_QUERY,
    // 'base:folder`: MY_FOLDER_QUERY
    // ...etc
};



// XP content types ('type' from the first meta response in fetchContent.ts) mapped to a getVariables function,
// which will return appropriate variables for the placeholders in the corresponding query: path => variablesObject
// path (the _id or _path of a target content item) is usually used in queries, so that's the argument the function will be called with.
// Whenever the selected query only uses the path placeholder (including the default query), nothing needs to be added here since the default function is enough: path => ({path: path})
export const variablesGetterSelector = {

    // EXAMPLES:
    // 'my.harcoded.appname:content-type': (path) => ({ path: path, otherParameter: otherValue }),          // If MY_IMPORTED_QUERY uses a $otherParameter parameter
    //'base:folder': (path) => ({ path: path, maxChildren: 1000 })                                          // If MY_FOLDER_QUERY uses a $maxChildren parameter
    // ...etc
};
