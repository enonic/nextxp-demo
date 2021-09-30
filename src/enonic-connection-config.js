const DEVELOPMENT = 0, PRODUCTION = 1;
const mode = DEVELOPMENT;


/** XP server domain, incl. protocol:// and :port. Eg. 'localhost:8080' in localhost:8080/site/default/draft/mysite/api */
const apiDomain = "http://localhost:8080";


/** Which site this server communicates with: content item _name for the root site item */
const siteName = 'hmdb';

/** Branch-specific (and domain-less) root URL to the XP site content, eg. 'site/default/draft/mysite' in localhost:8080/site/default/draft/mysite */
const siteRoot = `site/hmdb/draft/${siteName}`;

/** Mapped pattern to the controller of of the API, eg. 'api' in localhost:8080/site/default/draft/mysite/api */
const apiPostfix = 'api';

/** full app key = appName in gradle.properties in the XP app */
const appKey = "com.example.myproject";

/** The domain (full: with protocol and port if necessary) of this next.js server */
const nextDomain = "http://localhost:3000";

/** Where requests from XP CS previews (requesting next renderings) will come from */
const xpPreviewOrigin = apiDomain;




const siteUrl = `${apiDomain}/${siteRoot}`;
const contentApiUrl = `${siteUrl}/${apiPostfix}`;

const siteNamePattern = new RegExp('^/' + siteName + "/");
const publicPattern = new RegExp('^/?');

module.exports = {
    mode,
    nextDomain,
    apiDomain,
    xpPreviewOrigin,
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
    getXpPath: (siteRelativeContentPath) => `/${siteName}/${siteRelativeContentPath}`,


    /** Takes an XP _path string and returns a Next.js-server-ready URL for the corresponding content for that _path */
    getPageUrlFromXpPath: (mode === PRODUCTION)
        ? xpPath => xpPath.replace(siteNamePattern, '/')
        : xpPath => xpPath.replace(siteNamePattern, `${nextDomain}/`),


    /** Takes a Next.js-asset relative URL and returns an absolute URL if mode is not production */
    getPublicAssetUrl: (mode === PRODUCTION)
        ? serverRelativeAssetPath => serverRelativeAssetPath.replace(publicPattern, '/')
        : serverRelativeAssetPath => serverRelativeAssetPath.replace(publicPattern, `${nextDomain}/`)
};

