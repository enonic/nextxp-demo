import React from 'react';

import buildContentFetcher, { ContentFetcher } from "../shared/data/fetchContent";
import { querySelector, variablesGetterSelector} from "../selectors/querySelector";
import enonicConnectionConfig from "../enonic-connection-config";


const fetchContent: ContentFetcher = buildContentFetcher({
    enonicConnectionConfig,
    querySelector,
    variablesGetterSelector,
    firstMethodKey: true
});


////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below

import BasePage from "../components/BasePage";

type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] }
    /*req: {
    headers: {
        host: string,
        referer?: string
    },
    __NEXT_INIT_QUERY?: {
        __fromXp__?: any
    }
    }*/
};

export const getServerSideProps = async (context: Context) => {
    const pageProps = await fetchContent(context.params.contentPath);
    return {
        props: {
            ...pageProps
        }
    }
};

export default BasePage;
