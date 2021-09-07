import React from 'react';

import {fetchContent} from "../../shared/data/fetchContent";

import BasePage, { buildClientSideBasePage } from "../../components/BasePage";

import { getGuillotineUrlMaster } from '../../enonic-connection-config';


////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below


type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] };
};

export const getServerSideProps = async ({params}: Context) => ({
    props: await fetchContent(params.contentPath, getGuillotineUrlMaster)
});

export default BasePage;



////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above
/*

const ClientSideFetchBasePage = buildClientSideBasePage(getGuillotineUrlMaster);

export default ClientSideFetchBasePage;
*/
