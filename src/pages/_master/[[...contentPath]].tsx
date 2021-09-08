import React from 'react';

import buildContentFetcher from "../../shared/data/fetchContent";
import { querySelector, variablesGetterSelector} from "../../shared/querySelector";

const fetchContent = buildContentFetcher({
    querySelector,
    variablesGetterSelector,
    firstMethodKey: true
});


import BasePage from "../../components/BasePage";
import {buildClientSideBasePage} from "../../shared/clientSideBasePage";

const BRANCH = 'master';

////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below


type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] };
};

export const getServerSideProps = async ({params}: Context) => ({
    props: await fetchContent(params.contentPath, BRANCH)
});

export default BasePage;



////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above
/*

const ClientSideFetchBasePage = buildClientSideBasePage(BRANCH, fetchContent);

export default ClientSideFetchBasePage;
*/
