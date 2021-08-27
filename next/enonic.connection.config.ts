export const appName = "com.enonic.nextpoc.hmdb";                            // <-- appName in hmdb/gradle.properties
export const appNameUnderscored = appName.replace(/\./g, '_');
export const appNameDashed = appName.replace(/\./g, '-');

export const apiDomain = "http://localhost:8080";

export const apiServiceRoot = `_/service`;
export const apiServiceName = 'sitecontent';

export const apiUrl = `${apiDomain}/${apiServiceRoot}/${appName}/${apiServiceName}`;
