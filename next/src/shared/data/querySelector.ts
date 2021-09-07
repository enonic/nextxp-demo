import { appKey } from '../../enonic-connection-config';

import LOW_PERFORMING_DEFAULT_QUERY from "./queries/_getDefaultData";
import FOLDER_QUERY from "./queries/getFolder";
import LIST_QUERY from './queries/getList';
import MOVIE_QUERY from './queries/getMovie';
import PERSON_QUERY from './queries/getPerson';

// Content types mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from getContentDataQuery.
const contentTypeSpecificQueries = {
    //'base:folder': FOLDER_QUERY,

    'base:folder': LIST_QUERY,
    [`${appKey}:movie`]: MOVIE_QUERY,
    [`${appKey}:person`]: PERSON_QUERY,

    // 'my.example.app:content-type': '{ guillotine { get { custom query string etc } } }'
};



// TODO: more groundwork for custom variables any more than this?

// Content types mapped to a getVariables function that will return appropriate variables for the corresponding query.
// If type is not found here, the lowPerformingDefaultGetVariables function is used.
const contentTypeSpecificGetVariables = {
    //'base:folder': (idOrPath) => ({ idOrPath, maxChildren: 1000 })

    // 'my.example.app:content-type': (idOrPath) => ({ custom: variables etc })
};




/////////////////////////////////////////////////////////////////////////////////////////////

const defaultGetVariables = (idOrPath) => ({ idOrPath });


export default function getQueryAndVariables(type, idOrPath) {
    let query = contentTypeSpecificQueries[type];
    let getVariables = contentTypeSpecificGetVariables[type] || defaultGetVariables;

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
