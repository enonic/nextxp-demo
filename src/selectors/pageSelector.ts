import { appKey } from '../enonic-connection-config';

// EXAMPLE:
// import MyPage from '../components/pagetypes/MyPage;

// XP content types ('type' from the second data response in fetchContent.ts) mapped to top-level react components that render that content type.
// If content type is not found here, falls back to the default page renderer in pages/Default.tsx
export const pageSelector = {

    // EXAMPLES:
    // 'my-hardcoded-appname:my-content-type': MyPage,
    // [`${appKey}:my-content-type`]: MyPage,
    // 'base:folder': MyFolderPage
    // ...etc
};
