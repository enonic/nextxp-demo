import { appKey } from '../enonic-connection-config';

import FOLDER_QUERY from "../shared/data/queries/getFolder";

// Example:
// import MY_IMPORTED_QUERY from '../shared/data/queries/getMyContentType';

// Content types mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from _getDefaultData.ts!
export const querySelector = {
    //'base:folder': FOLDER_QUERY,

    // Examples:
    // 'my.harcoded.appname:my-content-type': '{ guillotine { get { hardcoded custom query string etc } } }'
    // [`${appKey}:my-content-type`]: MY_IMPORTED_QUERY,
};



// Content types mapped to a getVariables function, that will return appropriate variables for the placeholders in the corresponding query: idOrPath => variablesObject
// idOrPath (the _id or _path of a target content item) is usually used in queries, so that's the argument the function will be called with.
// Whenever the selected query only uses the idOrPath placeholder (including the default query), nothing needs to be added here since the default function is enough: idOrPath => ({idOrPath: idOrPath})
export const variablesGetterSelector = {
    //'base:folder': (idOrPath) => ({ idOrPath, maxChildren: 1000 })

    // EXAMPLE:
    // 'my.example.app:data-type': (idOrPath) => ({ idOrPath: idOrPath, otherPlaceHolder: otherValue })
};
