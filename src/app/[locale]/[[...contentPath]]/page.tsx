import React from 'react';
import {fetchContent, fetchContentPathsForAllLocales, FetchContentResult} from "@enonic/nextjs-adapter";
import MainView from '@enonic/nextjs-adapter/views/MainView';

import "@enonic/nextjs-adapter/baseMappings";
import "../../../components/_mappings";
import {draftMode} from 'next/headers';

export const dynamic = 'auto'
export const dynamicParams = false  // show 404 for missing in cache pages
export const revalidate = 3600  // The revalidate option is only available when using the Node.js Runtime.
// This means using the revalidate option with runtime = 'edge' will not work.
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// export const maxDuration = 5

export type PageProps = {
    locale: string,
    contentPath: string[],
}

export default async function Page({params}: { params: PageProps }) {
    const {isEnabled: draft} = draftMode();
    console.info(`Accessing page${draft ? ' (draft)' : ''}`, params);

    const data: FetchContentResult = await fetchContent(params);

    return (
        <MainView {...data}/>
    )
};

export async function generateStaticParams(props: { params: PageProps }): Promise<any[]> {
    return await fetchContentPathsForAllLocales('\${site}/');
}
