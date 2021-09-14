import React from 'react';

import buildContentFetcher from "../../shared/data/fetchContent";
import {querySelector, variablesGetterSelector} from "../../selectors/querySelector";

const fetchContent = buildContentFetcher({
    querySelector,
    variablesGetterSelector,
    firstMethodKey: true
});


const BRANCH = 'master';

////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below

import BasePage from "../../components/BasePage";

type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] }
    req: {
        headers: {
            host: string,
            referer?: string
        },
        __NEXT_INIT_QUERY?: {
            __fromXp__?: any
        }
    }
};

const getHost = (context: Context) => {
    if (context?.req?.__NEXT_INIT_QUERY?.__fromXp__ !== undefined) {
        console.log('Hostin')
        const host = context?.req?.headers?.host;
        const splitReferer = (context?.req?.headers?.referer || '').split('://');
        const protocol = (splitReferer || [])[0] || 'http';     // Defaults to http, assuming http auto-upgrades to https on most servers?
        return `${protocol}://${host}`
    }

    return undefined;
}

export const getServerSideProps = async (context: Context) => {
    const host = getHost(context);

    return (host)
        ? {
            props: {
                ...await fetchContent(context.params.contentPath, BRANCH),
                __host: host
            }
        }
        : {
            props: await fetchContent(context.params.contentPath, BRANCH)
        }
};

export default BasePage;


////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above
/*

import ClientSideBasePage from "../../components/ClientSideBasePage";

const ClientSidePage = () => <ClientSideBasePage branch={BRANCH} fetchContent={fetchContent} />;
export default ClientSidePage;
*/
