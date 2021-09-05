import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Seo from '../components/blocks/seo'

function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
            <Seo title="Poc" siteTitle="NextXP" />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp
