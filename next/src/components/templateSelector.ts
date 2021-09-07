import DefaultPage from "./templates/Default";
import { appKey } from '../enonic-connection-config';


import FolderPage from "./templates/Folder";

import ListPage from "./templates/List";
import MoviePage from "./templates/Movie";
import PersonPage from "./templates/Person";

// Content types mapped to full guillotine query strings.
// If type is not found here, falls back to the default template in templates/item.tsx
const contentTypeSpecificTemplate = {
    //'base:folder': FolderPage

   'base:folder': ListPage,
    [`${appKey}:person`]: PersonPage,
    [`${appKey}:movie`]: MoviePage
};

export const getTemplate = (contentType) => contentTypeSpecificTemplate[contentType] || DefaultPage;
