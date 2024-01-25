import {fetchContent, getAsset, I18n, LocaleContextProvider, RENDER_MODE, XP_REQUEST_TYPE} from '@enonic/nextjs-adapter';
import StaticContent from '@enonic/nextjs-adapter/views/StaticContent';
import {draftMode} from 'next/headers';
import {ReactNode} from 'react';

import '../../../styles/globals.css';
import Footer from '../../../components/views/Footer';
import Header from '../../../components/views/Header';

import {PageProps} from './page';

type LayoutProps = {
    params: PageProps
    children: ReactNode
}

export default async function PageLayout({params, children}: LayoutProps) {

    const {isEnabled: draft} = draftMode();
    const start = Date.now();
    console.info(`Accessing layout ${draft ? ' (draft)' : ''}`, params);

    const {meta} = await fetchContent(params);

    const duration = Date.now() - start;
    console.info(`Layout fetch took ${duration} ms`);

    const isEdit = meta?.renderMode === RENDER_MODE.EDIT;

    // Component rendering - for component updates in Content Studio without reloading page
    if (meta.requestType === XP_REQUEST_TYPE.COMPONENT) {
        return <StaticContent condition={isEdit}>
            {
                meta.renderMode === RENDER_MODE.NEXT ?
                    // don't wrap it in direct next access because we want to show 1 component on the page
                children :
                <details data-single-component-output="true">{children}</details>
            }
        </StaticContent>;
    }

    return (
        <LocaleContextProvider locale={params.locale}>
            <StaticContent condition={isEdit}>
                <Header meta={meta} title={I18n.localize('title')} logoUrl={getAsset('/images/xp-shield.svg', meta)}/>
                <main>{children}</main>
                <Footer/>
            </StaticContent>
        </LocaleContextProvider>
    )
}
