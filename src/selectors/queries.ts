import { appKey } from '../enonic-connection-config';


// XP content types ('type' from the first meta response in fetchContent.ts) mapped to full guillotine query strings.
// If type is not found here, a LOW-PERFORMING default query is selected from _getDefaultData.ts!
export const querySelector: QuerySelector = {

};



// XP content types ('type' from the first meta response in fetchContent.ts) mapped to a getVariables function,
// which will return appropriate variables for the placeholders in the corresponding query: path => variablesObject
// path (the _id or _path of a target content item) is usually used in queries, so that's the argument the function will be called with.
// Whenever the selected query only uses the path placeholder (including the default query), nothing needs to be added here since the default function is enough: path => ({path: path})
export const variablesGetterSelector: VariablesGetterSelector = {

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
