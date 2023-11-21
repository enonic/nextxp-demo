import React from 'react';
import {ContentPathItem, fetchContent, fetchContentPathsForAllLocales} from "@enonic/nextjs-adapter";
import MainView from '@enonic/nextjs-adapter/views/MainView';

import "@enonic/nextjs-adapter/baseMappings";
import "../../../../components/_mappings";

export const dynamic = 'force-static'
// export const dynamicParams = true
export const revalidate = 3600  // The revalidate option is only available when using the Node.js Runtime.
// This means using the revalidate option with runtime = 'edge' will not work.
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// export const maxDuration = 5

export type PageProps = {
    contentPath: string[],
    lang: string,
}

export async function generateStaticParams(): Promise<any[]> {
    const paths = await fetchContentPathsForAllLocales('\${site}/');
    return paths.map((path: ContentPathItem) => ({
        contentPath: path.params.contentPath,
        lang: path.locale,
    }));
}

export default async function Page({params}: { params: PageProps }) {
    console.info('Accessing page', params);

    const data = await fetchContent(params.contentPath)

    return (
        <MainView {...data}/>
    )
};
