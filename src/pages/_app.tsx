import type {AppProps} from 'next/app'


// import '../styles/globals.css'

import React from 'react';
import Head from "next/head";
import Layout from "../components/blocks/Layout";
import {getTypeSelection} from '../customXp/contentSelector';


/**
 * Wraps all rendered components
 * @param Component Usually triggering [[...contentPath]].tsx, this component is BasePage.tsx
 * @param pageProps {{content, common, meta, error}}
 */
function MyApp({Component, pageProps}: AppProps) {
    const typeSelection = getTypeSelection(pageProps.meta?.type);

    // Special case: in XP single-component rendering mode (used in edit mode when updating one targeted component without reloading the page),
    // only render the component surrounded by tags needed by post-processing in the proxy:
    // Same goes for empty output when there is no renderer or page controller defined for content type
    if (pageProps.meta?.xpRequestType === 'component' || !(typeSelection || pageProps.meta?.hasController)) {
        return <details data-single-component-output="true"><Component {...pageProps} /></details>;
    }


    // MAIN RENDERING:
    return (
        <>
        {/*<Layout {...pageProps?.content?.layoutProps}>*/}
            {!pageProps.meta?.xpRequestType && (
                <Head>
                    <base href='/'/>
                </Head>
            )}

            <Component {...pageProps} />
        {/*</Layout>*/}
        </>
    );
}

export default MyApp
