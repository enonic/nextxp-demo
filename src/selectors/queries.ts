import { appKey } from '../enonic-connection-config';


import PERSON_QUERY from '../shared/data/queries/getPerson';
import MOVIE_QUERY from '../shared/data/queries/getMovie';
import LIST_QUERY from '../shared/data/queries/getList';

// XP content types ('type' from the first meta response in fetchContent.ts) mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from _getDefaultData.ts!
export const querySelector: QuerySelector = {
    [`${appKey}:person`]: PERSON_QUERY,
    [`${appKey}:movie`]: MOVIE_QUERY,
    'base:folder': LIST_QUERY
};



// XP content types ('type' from the first meta response in fetchContent.ts) mapped to a getVariables function,
// which will return appropriate variables for the placeholders in the corresponding query: path => variablesObject
// path (the _id or _path of a target content item) is usually used in queries, so that's the argument the function will be called with.
// Whenever the selected query only uses the path placeholder (including the default query), nothing needs to be added here since the default function is enough: path => ({path: path})
export const variablesGetterSelector: VariablesGetterSelector = {
    'base:folder': (path:string) => ({ path, maxChildren: 1000 })                                          // If MY_FOLDER_QUERY uses a $maxChildren parameter
};


export type QuerySelector = {
    [fullContentType: string]: string
};
export type VariablesGetterFunc = (path: string) => {
    path: string,
    [variables: string]: any
};
export type VariablesGetterSelector = {
    [fullContentType: string]: VariablesGetterFunc
};
