const { guillotineQuery } = require('./queries/query');
const deepJsonParser = require('../processing/deep-json-parser');
const { mergeComponentsIntoPage } = require('../processing/process-components');
const { queryGetContentByRef } = require('./queries/fragments/fragments')
                                                                                                                        // const { getPortalFragmentContent } = require('/lib/headless/process-components');
                                                                                                                        // const { runInBranchContext } = require('/lib/headless/branch-context');
                                                                                                                        // const menuUtils = require('/lib/menu-utils');
                                                                                                                        // const cache = require('/lib/siteCache');
                                                                                                                        // const { getNotifications } = require('/lib/headless/guillotine/queries/notifications');
                                                                                                                        // const contentLib = require('/lib/xp/content');

const isMedia = (content) => content.__typename?.startsWith('media_');

const getContent = (idOrPath, branch) => {
    const response = guillotineQuery(
        queryGetContentByRef,
        {
            ref: idOrPath,
        },
        branch
    );

    const content = response?.get;
    if (!content) {
        return null;
    }

    if (isMedia(content)) {
        return content;
    }

    const contentWithParsedData = deepJsonParser(content, ['data', 'config', 'page']);

    // TODO: add fragment support:
    // if (content.__typename === 'portal_Fragment') {
    //     return getPortalFragmentContent(contentWithParsedData);
    // }

    const page = mergeComponentsIntoPage(contentWithParsedData);
                                                                                                                        // const breadcrumbs = runInBranchContext(() => menuUtils.getBreadcrumbMenu(idOrPath), branch);

    return {
        ...contentWithParsedData,
        page,
        components: undefined,
                                                                                                                        // ...(breadcrumbs && { breadcrumbs }),
    };
};


                                                                                                                        /*
                                                                                                                        const getContentFromLegacyPath = (path) => {
                                                                                                                            const legacyCmsKeyMatch = /\d+(?=\.cms$)/.exec(path);
                                                                                                                            if (!legacyCmsKeyMatch) {
                                                                                                                                return null;
                                                                                                                            }

                                                                                                                            const legacyCmsKey = legacyCmsKeyMatch[0];

                                                                                                                            const queryRes = contentLib.query({
                                                                                                                                query: `x.no-nav-navno.cmsContent.contentKey LIKE "${legacyCmsKey}"`,
                                                                                                                            });

                                                                                                                            return queryRes?.hits?.[0];
                                                                                                                        };
                                                                                                                        */

                                                                                                                        /*
                                                                                                                        const getRedirectContent = (idOrPath, branch) => {
                                                                                                                            const legacyPathTarget = runInBranchContext(() => getContentFromLegacyPath(idOrPath), branch);
                                                                                                                            if (legacyPathTarget) {
                                                                                                                                return {
                                                                                                                                    ...legacyPathTarget,
                                                                                                                                    __typename: 'no_nav_navno_InternalLink',
                                                                                                                                    data: { target: { _path: legacyPathTarget._path } },
                                                                                                                                };
                                                                                                                            }

                                                                                                                            const pathSegments = idOrPath.split('/');
                                                                                                                            const shortUrlPath = pathSegments.length === 3 && pathSegments[2];

                                                                                                                            if (shortUrlPath) {
                                                                                                                                const shortUrlTarget = runInBranchContext(
                                                                                                                                    () => contentLib.get({ key: `/redirects/${shortUrlPath}` }),
                                                                                                                                    branch
                                                                                                                                );

                                                                                                                                if (!shortUrlTarget) {
                                                                                                                                    return null;
                                                                                                                                }

                                                                                                                                if (shortUrlTarget.type === 'no.nav.navno:internal-link') {
                                                                                                                                    const target = shortUrlTarget.data?.target;
                                                                                                                                    if (!target) {
                                                                                                                                        return null;
                                                                                                                                    }

                                                                                                                                    const targetContent = getContent(target);
                                                                                                                                    if (!targetContent) {
                                                                                                                                        return null;
                                                                                                                                    }

                                                                                                                                    return {
                                                                                                                                        ...shortUrlTarget,
                                                                                                                                        __typename: 'no_nav_navno_InternalLink',
                                                                                                                                        data: { target: { _path: targetContent._path } },
                                                                                                                                    };
                                                                                                                                }

                                                                                                                                if (shortUrlTarget.type === 'no.nav.navno:external-link') {
                                                                                                                                    return {
                                                                                                                                        ...shortUrlTarget,
                                                                                                                                        __typename: 'no_nav_navno_ExternalLink',
                                                                                                                                    };
                                                                                                                                }

                                                                                                                                if (shortUrlTarget.type === 'no.nav.navno:url') {
                                                                                                                                    return {
                                                                                                                                        ...shortUrlTarget,
                                                                                                                                        __typename: 'no_nav_navno_Url',
                                                                                                                                    };
                                                                                                                                }
                                                                                                                            }

                                                                                                                            return null;
                                                                                                                        };*/

const getSiteContent = (idOrPath, branch = 'master') => {
                                                                                                                        /*
                                                                                                                        const content = cache.getSitecontent(
                                                                                                                            idOrPath,
                                                                                                                            branch,
                                                                                                                            () => getContent(idOrPath, branch) || getRedirectContent(idOrPath, branch)
                                                                                                                        );
                                                                                                                        */
    const content = getContent(idOrPath, branch);

                                                                                                                        /*
                                                                                                                        if (!content) {
                                                                                                                            return null;
                                                                                                                        }

                                                                                                                        if (isMedia(content)) {
                                                                                                                            return content;
                                                                                                                        }
                                                                                                                        */

                                                                                                                        // const notifications = getNotifications(content._path);

    return content || null;                                                                                             // return { ...content, ...(notifications && { notifications }) };
};

module.exports = { getSiteContent, getContent };
