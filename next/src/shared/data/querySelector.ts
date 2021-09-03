import {getContentDataQuery} from "./queries/_defaultGetData";



// Enables maxChildren with the _defaultGetData call: fetching basic data of child items below folder contents.
// Set to 0 or something falsy to disable.
const DEFAULT_MAX_CHILDREN = 1000;



// Content types mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from getContentDataQuery.
const contentTypeSpecificQueries = {
    // 'my.example.app:content-type': '{ guillotine { get { custom query string etc } } }'
};



// TODO: more groundwork for custom variables any more than this?

// Content types mapped to a getVariables function that will return appropriate variables for the corresponding query.
// If type is not found here, the lowPerformingDefaultGetVariables function is used.
const contentTypeSpecificGetVariables = {
    // 'my.example.app:content-type': (idOrPath) => ({ custom: variables etc })
};



/////////////////////////////////////////////////////////////////////////////////////////////

const LOW_PERFORMING_DEFAULT_QUERY = getContentDataQuery(DEFAULT_MAX_CHILDREN);

const defaultGetVariables = (DEFAULT_MAX_CHILDREN > 0)
    ? (idOrPath) => ({
        idOrPath,
        maxChildren: DEFAULT_MAX_CHILDREN
    })
    : (idOrPath) => ({ idOrPath });





export default function getQueryAndVariables(type, idOrPath) {
    let query = contentTypeSpecificQueries[type];
    let getVariables = contentTypeSpecificGetVariables[type];

    // Default query and variables if no content-type-specific query was found for the type
    if (!query) {
        query = LOW_PERFORMING_DEFAULT_QUERY;
        getVariables = defaultGetVariables;
    }

    return {
        query,
        variables: getVariables(idOrPath)
    }
};
