import Footer from '../../../../components/views/Footer';
import Header from '../../../../components/views/Header';
import {fetchContent, getUrl} from '@enonic/nextjs-adapter';
import {Metadata, ResolvingMetadata} from 'next';
import {ReactNode} from 'react';
import {PageProps} from './page';

export type LayoutProps = {
    params: PageProps
    children: ReactNode
}

export default async function ContentLayout(props: LayoutProps) {

    const {meta, common} = await fetchContent(props.params.contentPath)

    return (<>
            <Header meta={meta} title={common?.get?.displayName} logoUrl={getUrl('/images/xp-shield.svg', meta)}/>
            <main style={{
                margin: `0 auto`,
                maxWidth: 960,
                padding: `0 1rem`,
            }}>
                {props.children}
            </main>
            <Footer/>
        </>
    )
}

export async function generateMetadata(props: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {

    const {common} = await fetchContent(props.params.contentPath)

    return {
        title: common?.get?.displayName || 'Content path layout',
    }
}
