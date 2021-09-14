const project = 'default';                                                      // <-- project identifier in path, e.g. 'default' in the URL <domain>/site/default/master
const appKey = "com.example.xp.myapp";                                          // <-- full app key = appName in hmdb/gradle.properties

const appKeyUnderscored = appKey.replace(/\./g, '_');
const appKeyDashed = appKey.replace(/\./g, '-');

const apiDomain = "http://localhost:8080";



const siteRootUrlMaster = `${apiDomain}/site/${project}/master`;
const siteRootUrlDraft = `${apiDomain}/site/${project}/draft`;

// appName is the content _name of the root site content-item:
const getGuillotineUrlMaster = (appName) => `${siteRootUrlMaster}/${appName}/api`;
const getGuillotineUrlDraft = (appName) => `${siteRootUrlDraft}/${appName}/api`;

const nextDomain = "http://localhost:3000";

module.exports = {
    project,
    appKey,
    appKeyUnderscored,
    appKeyDashed,
    apiDomain,
    siteRootUrlDraft,
    siteRootUrlMaster,
    nextDomain,
    getGuillotineUrlMaster,
    getGuillotineUrlDraft
};
