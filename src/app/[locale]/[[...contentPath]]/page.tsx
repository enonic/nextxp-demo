import React from 'react';
import {ContentPathItem, fetchContent, fetchContentPathsForAllLocales, FetchContentResult} from "@enonic/nextjs-adapter";
import MainView from '@enonic/nextjs-adapter/views/MainView';

import "@enonic/nextjs-adapter/baseMappings";
import "../../../components/_mappings";
import {notFound} from 'next/navigation';

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
    console.info('Accessing page', params);

    const data: FetchContentResult = await fetchContent(params.contentPath)

    if (data.error?.code === '404') {
        notFound();
    }

    return (
        <MainView {...data}/>
    )
};

export async function generateStaticParams(props: { params: PageProps }): Promise<any[]> {
    const paths = await fetchContentPathsForAllLocales('\${site}/');
    const result = paths.map((item: ContentPathItem) => ({
        contentPath: item.params.contentPath,
        locale: item.locale,
    }));
    console.info('Content path layout paths: ', result);
    return result;
}
