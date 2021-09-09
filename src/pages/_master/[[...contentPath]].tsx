import React from 'react';

import buildContentFetcher from "../../shared/data/fetchContent";
import { querySelector, variablesGetterSelector} from "../../selectors/querySelector";

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
    params: { contentPath: string[] };
};

export const getServerSideProps = async ({params}: Context) => ({
    props: await fetchContent(params.contentPath, BRANCH)
});

export default BasePage;



////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above
/*

import ClientSideBasePage from "../../components/ClientSideBasePage";

const ClientSidePage = () => <ClientSideBasePage branch={BRANCH} fetchContent={fetchContent} />;
export default ClientSidePage;
*/
