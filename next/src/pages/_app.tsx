import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Layout from '../components/blocks/layout'
import SEO from '../components/blocks/seo'

function MyApp({Component, pageProps}: AppProps) {
    return (
        <Layout siteTitle="Enonic ❤ NextJS">
            <SEO title={pageProps.title} siteTitle="NextXP Poc" />
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp
