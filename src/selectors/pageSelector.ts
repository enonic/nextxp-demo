import { appKey } from '../enonic-connection-config';

// EXAMPLE:
import ListPage from '../components/pagetypes/List';
import PersonPage from '../components/pagetypes/Person';
import MoviePage from '../components/pagetypes/Movie';

// XP content types ('type' from the second data response in fetchContent.ts) mapped to top-level react components that render that content type.
// If content type is not found here, falls back to the default page renderer in pages/Default.tsx
export const pageSelector = {
    [`${appKey}:person`]: PersonPage,
    [`${appKey}:movie`]: MoviePage,
    'base:folder': ListPage
};
