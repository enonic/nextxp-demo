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
    return {
        props: await fetchContent(context.params.contentPath, BRANCH)
    }
};

export default BasePage;
