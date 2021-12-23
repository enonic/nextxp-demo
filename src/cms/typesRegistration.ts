import {TypesRegistry, CATCH_ALL_NAME} from '../enonicAdapter/types/TypesRegistry';

import DefaultView from "./contentTypes/_DefaultView";
import DefaultPartView from "./parts/_Part";
import DefaultLayoutView from "./layouts/_Layout";

// Do the required enonic types registration
import "../enonicAdapter/types/enonicTypesRegistration";




////////////////  Catch-alls / default behavior: rendering all types that haven't been registered specifically above, with a default view.
// This is optional, without this null is returned instead of a rendering.

TypesRegistry.addContentType(CATCH_ALL_NAME, { view: DefaultView });
TypesRegistry.addPart(CATCH_ALL_NAME, { view: DefaultPartView });
TypesRegistry.addLayout(CATCH_ALL_NAME, { view: DefaultLayoutView });




///////////////// Register content types:

/*
TypesRegistry.addContentType(EXAMPLE_CONTENTTYPE_NAME, {
    query: optionalExampleQueryString,
    props: optionalExamplePropsPreprocessorFunction,
    view: OptionalExampleReactComponent,
});
*/




///////////////// Register part types:

/*
TypesRegistry.addPart(EXAMPLE_PART_NAME, {
    query: optionalQueryString,
    props: optionalPropsPreprocessorFunction,
    view: OptionalReactComponent,
});
*/




///////////////// Register Layout Types:

/*
TypesRegistry.addPart(EXAMPLE_LAYOUT_NAME, {
    query: anotherQueryString,
    props: anotherPropsPreprocessorFunction,
    view: AnotherReactComponent,
});
*/
