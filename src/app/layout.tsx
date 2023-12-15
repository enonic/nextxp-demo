import {fetchContent, getUrl, PORTAL_COMPONENT_ATTRIBUTE} from '@enonic/nextjs-adapter';
import {Metadata} from 'next';
import {ReactNode} from 'react';

import '../styles/globals.css';

import {PageProps} from './[locale]/[[...contentPath]]/page';
import Header from '../components/views/Header';
import Footer from '../components/views/Footer';

export type LayoutProps = {
    params: PageProps
    children: ReactNode
}

const title = 'Next.XP 3.0';

export default async function RootLayout({params, children}: LayoutProps) {

    const bodyAttrs: { [key: string]: string } = {
        className: "edit",
        [PORTAL_COMPONENT_ATTRIBUTE]: "page"
    }

    const {meta} = await fetchContent(params);

    return (
        <html lang="en">
        <body {...bodyAttrs}>
        <Header meta={meta} title={title} logoUrl={getUrl('/images/xp-shield.svg', meta)}/>
        <main>{children}</main>
        <Footer/>
        </body>
        </html>
    )
}

export const metadata: Metadata = {
    title: {
        default: title,
        template: '%s | Next.XP',
    },
    description: 'The React Framework for Enonic XP',
}
