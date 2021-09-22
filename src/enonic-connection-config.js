const CONNECTION_CONFIG = {
    /** XP server domain, incl. protocol:// and :port. Eg. 'localhost:8080' in localhost:8080/site/default/draft/mysite/api */
    apiDomain: "http://localhost:8080",

    /** XP content project, eg. 'default' in localhost:8080/site/default/draft/mysite/api */
    project: 'hmdb',

    /** Optional: siteName is the _name of a root site content in XP, aka 'mysite' in localhost:8080/site/default/draft/mysite/api.
     *  If siteName is hardcoded here, the sub/uri (in the next.js request url, e.g. localhost:3000/_draft/sub/uri) will refer to content BELOW that site.
     *  If siteName is missing/falsy here, the first item ('sub' in localhost:3000/_draft/sub/uri) is interpreted as the _name of the site.
     */
    siteName: 'hmdb',

    /** Mapped pattern to the controller of of the API, eg. 'api' in localhost:8080/site/default/draft/mysite/api */
    postfix: 'api',

    /** full app key = appName in gradle.properties in the XP app */
    appKey: "com.example.myproject",

    /** the domain of this next.js server */
    nextDomain: "http://localhost:3000",
};


/**
 * Returns the URL to a guillotine API. If no siteName is found in CONNECTION_CONFIG above, the site _name is expected to be the first item in the contentPathArray.
 * @param branch {string} 'master' or 'branch'. Unchecked here, caller must enforce.
 * @param contentPathArray {string[]} array-ified sub-path below <nextDomain>/_branch/ or <nextDomain>/_master/ - aka. the contentPath from [[...contentPath]].tsx. Eg. ['sub', 'uri'] from localhost:3000/_draft/sub/uri
 * @return <apiDomain>/site/<project>/<branch>/<siteName>/<postfix>, E.g. localhost:8080/site/default/draft/mysite/api
 */
const getContentApiUrl = (branch, contentPathArray) => {
    const siteName = CONNECTION_CONFIG.siteName || contentPathArray[0];
    return `${CONNECTION_CONFIG.apiDomain}/site/${CONNECTION_CONFIG.project}/${branch}/${siteName}/${CONNECTION_CONFIG.postfix}`;
};

/**
 *
 * @param contentPathString {string}
 * @return {string}
 */
const getFullContentPath = (contentPathString) => {
    return (CONNECTION_CONFIG.siteName)
        ? `/${CONNECTION_CONFIG.siteName}/${contentPathString}`
        : `/${contentPathString}`
};

module.exports = {
    ...CONNECTION_CONFIG,
    appKeyUnderscored: CONNECTION_CONFIG.appKey.replace(/\./g, '_'),
    appKeyDashed: CONNECTION_CONFIG.appKey.replace(/\./g, '-'),
    getContentApiUrl,
    getFullContentPath
};


