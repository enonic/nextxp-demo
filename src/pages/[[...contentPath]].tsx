import React from 'react';

import buildContentFetcher, { ContentFetcher } from "../shared/data/fetchContent";
import { querySelector, variablesGetterSelector } from "../selectors/queries";
import enonicConnectionConfig from "../enonic-connection-config";

type EnonicConnectionConfig = {
    contentApiUrl: string,
    getXpPath: (string)=>string
};

const fetchContent: ContentFetcher = buildContentFetcher<EnonicConnectionConfig>({
    enonicConnectionConfig,
    querySelector,
    variablesGetterSelector,
    firstMethodKey: true
});


////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below

import BasePage from "../components/BasePage";

type Context = {
    params: { contentPath: string[] }
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
