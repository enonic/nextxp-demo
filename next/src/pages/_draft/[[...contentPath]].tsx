import React from 'react';

import {fetchContent} from "../../shared/data/fetchContent";

import BasePage, {buildClientSideBasePage} from "../../components/BasePage";


import { getGuillotineUrlDraft } from '../../enonic-connection-config';


////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below
/*


type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] };
};

export const getServerSideProps = async ({params}: Context) => {
    return {
        props: await fetchContent(params.contentPath, getGuillotineUrlDraft)
    };
};

export default BasePage;

*/



////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above

const ClientSideFetchBasePage = buildClientSideBasePage(getGuillotineUrlDraft);

export default ClientSideFetchBasePage;
