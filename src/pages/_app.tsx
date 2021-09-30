import '../styles/globals.css'
import type {AppProps} from 'next/app'

import Seo from '../components/blocks/seo'
import Layout from '../components/blocks/layout'

function MyApp({Component, pageProps}: AppProps) {
    return (
        <Layout siteTitle="Next.js PoC">
            <Seo title="Poc" siteTitle="NextXP" />
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp
