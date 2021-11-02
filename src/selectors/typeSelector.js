// Used to fully qualify content type strings in the connected XP app:
import {appName} from "../enonic-connection-config";


/////////////////////////////////////////////////////////////////////////  TypeSelector:

/**
 *  Object where keys are full XP content type strings (eg. 'my.app:content-type') and values are (optional) type-specific 'TypeSelection' objects.
 *  A 'TypeSelection' object is a set of objects that each configure the handling of a particular content type: a get-content query, a function to get variables (including the path), a props preprocessor function and a page react component for rendering.
 *  All attributes in each 'TypeSelection' object are optional (see examples below), and missing values will fall back to default behavior:
 *          - 'query' (used in fetchContent.ts) Guillotine query for fetching content data, may also have a function that supplies guillotine variables: 'query' can EITHER be only a query string, OR also add a get-guillotine-variables function. In the latter case, 'query' can be an object (with 'query' and 'variables' attributes in it), or an array where the query string is first and the get-variables function is second. Either way, the get-variables function takes two arguments: path (content path, mandatory) and context (next.js-supplied Context from getServerSideProps etc. Optional, and requires that fetchContent is called with the context, of course).
 *          - 'props' (used in fetchContent.ts) A function for processing props: converting directly-from-guillotine props to props adapted for displaying the selected page component
 *          - 'page' (used in BasePage.tsx) is a react component: top-level content-type-specific rendering with the props first fetched from guillotine (and then optionally preprocessed with the function in 'props').
 */
const typeSelector = {

    /* EXAMPLES:

    'my.app:my-content-type': {
        query: 'I am a guillotine query string specialized in fetching data for my-content-type'
    },

    // ...or...

    [`${appName}:anotherContentType`]: {
        query: [
            'I am a guillotine query string specialized in fetching data for anotherContentType',
            (xpContentPath, contextFromNext) => guillotineVariables
        ],
        props: (rawPropsFromGuillotine, contextFromNext) => processedPropsReadyForPageComponent,
        page: PageReactComponentForDisplayingThisContentTypeWithProcessedProps
    },

    // ...etc
    */
};


export default typeSelector;
