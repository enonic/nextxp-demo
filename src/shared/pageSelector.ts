import { appKey } from '../enonic-connection-config';


import FolderPage from "../components/templates/Folder";

import ListPage from "../components/templates/List";
import MoviePage from "../components/templates/Movie";
import PersonPage from "../components/templates/Person";

// Content types mapped to full guillotine query strings.
// If type is not found here, falls back to the default template in templates/item.tsx
export const pageSelector = {
    //'base:folder': FolderPage

   'base:folder': ListPage,
    [`${appKey}:person`]: PersonPage,
    [`${appKey}:movie`]: MoviePage
};

