import DefaultPage from "./templates/default";

import FolderPage from "./templates/folder";

// Content types mapped to full guillotine query strings.
// If type is not found here, falls back to the default template in templates/item.tsx
const contentTypeSpecificTemplate = {
    'base:folder': FolderPage
};

export const getTemplate = (contentType) => contentTypeSpecificTemplate[contentType] || DefaultPage;
