// XP server domain, incl. <protocol>:// and :<port>. Eg. 'http://localhost:8080' in http://localhost:8080/site/default/draft/mysite/api
const apiDomain = "http://localhost:8080";

// Which site this server communicates with: content item _name for the root site item
const siteName = 'hmdb';

/** URL to the guillotine API */
const contentApiUrl = `${apiDomain}/site/hmdb/draft/${siteName}/api`;

// full app key = appName in gradle.properties in the XP app
const appName = "com.example.myproject";

module.exports = {
    apiDomain,
    siteName,
    contentApiUrl,
    appName,

    // makes appName variations used in different contexts, eg. queries:
    appNameUnderscored: appName.replace(/\./g, '_'),
    appNameDashed: appName.replace(/\./g, '-'),

    /**
     * Prefix the site-relative content path with the XP site _name and returns a full XP _path string.
     * @param siteRelativeContentPath {string} The contentPath slug array from [[...contentPath]].tsx, stringified and slash-delimited
     * @returns {string} Fully qualified XP content path */
    getXpPath: (siteRelativeContentPath) => `/${siteName}/${siteRelativeContentPath}`,
};
