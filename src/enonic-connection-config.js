const DEVELOPMENT = 0, PRODUCTION = 1;
const mode = DEVELOPMENT;




// XP server domain, incl. <protocol>:// and :<port>. Eg. 'http://localhost:8080' in http://localhost:8080/site/default/draft/mysite/api
const apiDomain = "http://localhost:8080";

// Which site this server communicates with: content item _name for the root site item
const siteName = 'hmdb';

/** URL to the guillotine API */
const contentApiUrl = `${apiDomain}/site/hmdb/draft/${siteName}/api`;

// full app key = appName in gradle.properties in the XP app
const appName = "com.example.myproject";

/** The domain (full: with protocol and port if necessary) of this next.js server */
const nextDomain = "http://localhost:3000";

/** Where requests from XP CS previews (requesting next renderings) will come from */
const xpPreviewOrigin = apiDomain;

// URI parameter marking that a request is for a preview for CS. MUST MATCH FROM_XP_PARAM on XP side.
const FROM_XP_PARAM = '__fromXp__';









// ------------------------------- Exports and auxillary functions derived from values above ------------------------------------

/** Returns true if the context object (from next.js in [[...contentPath]].jsx ) stems from a request that comes from XP in a CS-preview, i.e. has the URI param FROM_XP_PARAM (defined as '__fromXp__' above).
 *  False if no context, query or FROM_XP_PARAM param */
const requestIsFromXp = (context) => {
    return !!((context?.query || {})[FROM_XP_PARAM]) || !!((context?.req?.headers || {})[FROM_XP_PARAM])
}

const siteNamePattern = new RegExp('^/' + siteName + "/");
const publicPattern = new RegExp('^/*');

module.exports = {
    mode, DEVELOPMENT, PRODUCTION,

    nextDomain,
    xpPreviewOrigin,
    fromXpParam: FROM_XP_PARAM,

    apiDomain,
    siteName,
    contentApiUrl,
    appName,

    // makes appName variations used in different contexts, eg. queries:
    appNameUnderscored: appName.replace(/\./g, '_'),
    appNameDashed: appName.replace(/\./g, '-'),


    /**
     * Prefix the site-relative content path with the XP site _name and returns a full XP _path string.
     * @param pageUrl {string} The contentPath slug array from [[...contentPath]].tsx, stringified and slash-delimited. Aka. nextjs.side-relative content path.
     * @returns {string} Fully qualified XP content path */
    getXpPath: (pageUrl) => `/${siteName}/${pageUrl}`,

    /** Takes an XP _path string and returns a Next.js-server-ready URL for the corresponding content for that _path */
    getPageUrlFromXpPath: (xpPath, context) => requestIsFromXp(context)
        ? xpPath.replace(siteNamePattern, `${nextDomain}/`)     // proxy-relative: should be absolute when served through the proxy
        : xpPath.replace(siteNamePattern, '/'),                 // site relative: should just start with slash when served directly

    /** Special-case (for <a href link values in props that target XP content pages - for when links too should work in CS) version of getPageUrlFromXpPath, depending on whether or not the request stems from the XP proxy used for content studio preview, or not */
    getContentLinkUrlFromXpPath: (xpPath, context) => requestIsFromXp(context)
        ? xpPath.replace(siteNamePattern, '')           // proxy-relative: should not start with a slash when served through the proxy
        : xpPath.replace(siteNamePattern, '/'),         // site relative: should start with slash when served directly

    /**
     * If the request stems from XP (the CS-preview proxy), assets under the /public/ folder needs to have their URL prefixed with the running domain of this next.js server. If not, prefix only with a slash.
     * @param serverRelativeAssetPath Regular next.js asset path
     * @param context nextjs context
     * @returns {string}
     */
    getPublicAssetUrl: (serverRelativeAssetPath, context) => requestIsFromXp(context)
        ? serverRelativeAssetPath.replace(publicPattern, `${nextDomain}/`)
        : serverRelativeAssetPath.replace(publicPattern, `/`),

    /** Returns true if the context object from next.js stems from a request that comes from XP in a CS-preview, i.e. has the URI param FROM_XP_PARAM (value above) */
    requestIsFromXp
};

