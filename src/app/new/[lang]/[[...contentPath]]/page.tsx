import React from 'react';
import {ContentPathItem, EnonicView, fetchContentPathsForAllLocales} from "@enonic/nextjs-adapter";

import "@enonic/nextjs-adapter/baseMappings";
import "../../../../components/_mappings";
import {headers} from 'next/headers';

export const dynamic = 'force-static'
// export const dynamicParams = true
export const revalidate = 3600  // The revalidate option is only available when using the Node.js Runtime.
// This means using the revalidate option with runtime = 'edge' will not work.
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// export const maxDuration = 5

export interface PageProps {
    contentPath: string[],
    lang: string,
}

export async function generateStaticParams(): Promise<any[]> {
    const paths = await fetchContentPathsForAllLocales('\${site}/');
    const result = paths.map((path: ContentPathItem) => ({
        contentPath: path.params.contentPath,
        lang: path.locale,
    }));
    console.info(result);
    return result;
}

export default async function Page({params}: { params: PageProps }) {
    console.info('Accessing page', params);

    const data = fetchData(params.contentPath);

    headers()

    return (
        <EnonicView contentPath={params.contentPath}/>
    )
};
