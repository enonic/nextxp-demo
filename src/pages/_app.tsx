import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Seo from '../components/blocks/seo'
import Layout from '../components/blocks/layout'


function MyApp({Component, pageProps}: AppProps) {
    //console.log("pageProps: ", pageProps);
    return (
        <Layout siteTitle="Next.js PoC" random={pageProps.staticRandom}>
            <Seo title="Poc" siteTitle="NextXP" />
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp
