const project = 'hmdb';                                                  // <-- project identifier in path, e.g. 'default' in the URL <domain>/site/default/master
const appKey = "com.enonic.nextpoc.hmdb";                                // <-- full app key = appName in hmdb/gradle.properties

const appKeyUnderscored = appKey.replace(/\./g, '_');
const appKeyDashed = appKey.replace(/\./g, '-');

const apiDomain = "http://localhost:8080";

const apiContentBase = '_contentbase';
const apiContentFull = '_content';

const siteRootUrlMaster = `${apiDomain}/site/${project}/master`;
const siteRootUrlDraft = `${apiDomain}/site/${project}/draft`;

// appName is the content _name of the root site content-item:
const contentApiUrlGetters = {
    master: {
        base: (appName) => `${siteRootUrlMaster}/${appName}/${apiContentBase}`,
        full: (appName) => `${siteRootUrlMaster}/${appName}/${apiContentFull}`
    },
    draft: {
        base: (appName) => `${siteRootUrlDraft}/draft/${appName}/${apiContentBase}`,
        full: (appName) => `${siteRootUrlDraft}/draft/${appName}/${apiContentFull}`
    }
};

module.exports = {
    project,
    appKey,
    appKeyUnderscored,
    appKeyDashed,
    apiDomain,
    apiContentBase,
    apiContentFull,
    siteRootUrlDraft,
    siteRootUrlMaster,
    contentApiUrlGetters
};
