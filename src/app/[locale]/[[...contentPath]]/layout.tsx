import Footer from '../../../components/views/Footer';
import Header from '../../../components/views/Header';
import {fetchContent, getUrl} from '@enonic/nextjs-adapter';
import {Metadata, ResolvingMetadata} from 'next';
import {ReactNode} from 'react';
import {PageProps} from './page';

export type LayoutProps = {
    params: PageProps
    children: ReactNode
}

export default async function ContentLayout({params, children}: LayoutProps) {

    const {meta, common} = await fetchContent(params);

    return (<>
            <Header meta={meta} title={common?.get?.displayName} logoUrl={getUrl('/images/xp-shield.svg', meta)}/>
            <main style={{
                margin: `0 auto`,
                maxWidth: 960,
                padding: `0 1rem`,
            }}>
                {children}
            </main>
            <Footer/>
        </>
    )
}

export async function generateMetadata({params}: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {

    const {common} = await fetchContent(params);

    return {
        title: common?.get?.displayName || 'Content path layout',
    }
}
