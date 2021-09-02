const project = 'hmdb';                                                  // <-- project identifier in path, e.g. 'default' in the URL <domain>/site/default/master
const appKey = "com.enonic.nextpoc.hmdb";                                // <-- full app key = appName in hmdb/gradle.properties

const appKeyUnderscored = appKey.replace(/\./g, '_');
const appKeyDashed = appKey.replace(/\./g, '-');

const apiDomain = "http://localhost:8080";

const apiContentMeta = '_contentmeta';
const apiContent = '_content';

const siteRootUrlMaster = `${apiDomain}/site/${project}/master`;
const siteRootUrlDraft = `${apiDomain}/site/${project}/draft`;


// appName is the content _name of the root site content-item:
const contentApiUrlGetters = {
    master: {
        getMetaUrl: (appName) => `${siteRootUrlMaster}/${appName}/${apiContentMeta}`,
        getContentUrl: (appName) => `${siteRootUrlMaster}/${appName}/${apiContent}`
    },
    draft: {
        getMetaUrl: (appName) => `${siteRootUrlDraft}/${appName}/${apiContentMeta}`,
        getContentUrl: (appName) => `${siteRootUrlDraft}/${appName}/${apiContent}`
    }
};

module.exports = {
    project,
    appKey,
    appKeyUnderscored,
    appKeyDashed,
    apiDomain,
    apiContentMeta,
    apiContent,
    siteRootUrlDraft,
    siteRootUrlMaster,
    contentApiUrlGetters
};
