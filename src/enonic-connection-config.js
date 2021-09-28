
/** XP server domain, incl. protocol:// and :port. Eg. 'localhost:8080' in localhost:8080/site/default/draft/mysite/api */
const apiDomain = "http://localhost:8080";

/** Which site this server communicates with: content item _name for the root site item */
const siteName = 'hmdb';

/** Which branch this server communicates with: 'draft' or 'master' */
const branch = 'draft';

/** Branch-specific root to the site, eg. 'site/default/draft/mysite' in localhost:8080/site/default/draft/mysite */
const siteRoot = `site/hmdb/${branch}/${siteName}`;

/** Mapped pattern to the controller of of the API, eg. 'api' in localhost:8080/site/default/draft/mysite/api */
const apiPostfix = 'api';

/** full app key = appName in gradle.properties in the XP app */
const appKey = "com.example.myproject";

/** The domain (full: with protocol and port if necessary) of this next.js server */
const nextDomain = "http://localhost:3000";


const siteUrl = `${apiDomain}/${siteRoot}`;
const contentApiUrl = `${siteUrl}/${apiPostfix}`;




module.exports = {
    nextDomain,
    apiDomain,
    branch,
    siteName,
    siteRoot,
    contentApiUrl,
    appKey,
    appKeyUnderscored: appKey.replace(/\./g, '_'),
    appKeyDashed: appKey.replace(/\./g, '-'),

    /**
     * Returns the full XP _path value to a content item, from it's site-relative content path.
     * Eg., if a content item is accessed at the next.js side with localhost:3000/sub/path, then the site-relative content path is '/sub/path/',
     * and the full _path returned is the string '/mysite/sub/path'.
     */
    getFullContentPath: (siteRelativeContentPath) => `/${siteName}/${siteRelativeContentPath}`,

    /** Convert an image URL from site-relative imageUrl (from guillotine) to full image url (where a browser can access an image from XP). */
    getImageUrl: (siteRelativeImageUrl) => `${apiDomain}/${siteRoot}${siteRelativeImageUrl}`,
};


//////////////////////////////////////// Checks:

if (branch !== 'draft' && branch !== 'master') {
    throw Error("draft must be 'draft' or 'master'.");
}

