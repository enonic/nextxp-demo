import { appKey } from '../enonic-connection-config';

// EXAMPLE:

// XP content types ('type' from the second data response in fetchContent.ts) mapped to top-level react components that render that content type.
// If content type is not found here, falls back to the default page renderer in pages/Default.tsx
export const pageSelector = {
};

export type PageSelector = { [fullContentType:string]: JSX.Element };
