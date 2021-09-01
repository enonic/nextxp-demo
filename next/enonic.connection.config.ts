export const project = 'hmdb';                                                  // <-- project identifier in path, e.g. 'default' in the URL <domain>/site/default/master
export const appKey = "com.enonic.nextpoc.hmdb";                                // <-- full app key = appName in hmdb/gradle.properties

export const appNameUnderscored = appKey.replace(/\./g, '_');
export const appNameDashed = appKey.replace(/\./g, '-');

export const apiDomain = "http://localhost:8080";

export const apiContentBase = '_contentbase';
export const apiContentFull = '_content';

export const siteRootUrlMaster = `${apiDomain}/site/${project}/master`;
export const siteRootUrlDraft = `${apiDomain}/site/${project}/draft`;

// appName is the content _name of the root site content-item:
export const contentApiUrlGetters = {
    master: {
        base: (appName) => `${siteRootUrlMaster}/${appName}/${apiContentBase}`,
        full: (appName) => `${siteRootUrlMaster}/${appName}/${apiContentFull}`
    },
    draft: {
        base: (appName) => `${siteRootUrlDraft}/draft/${appName}/${apiContentBase}`,
        full: (appName) => `${siteRootUrlDraft}/draft/${appName}/${apiContentFull}`
    }
};
