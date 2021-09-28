import { siteName, siteRoot } from '../../enonic-connection-config';

const siteNamePattern = new RegExp('^/' + siteName);
const siteRootPattern = new RegExp('^/' + siteRoot);

export const getSiteRelativePath = _path => _path.replace(siteNamePattern, '')

export const getSiteRelativeImageUrl = guillotineImageUrl => {
    console.log(guillotineImageUrl);
    console.log(siteRootPattern);
    console.log(guillotineImageUrl.replace(siteRootPattern, ''));
    return guillotineImageUrl.replace(siteRootPattern, '')
}
