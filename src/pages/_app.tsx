import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from 'next/head';


function MyApp({Component, pageProps}: AppProps) {
    console.log("pageProps: ", pageProps);
    return (
        <>
            {
                pageProps.meta &&
                <Head>
                    <base href={`/_${pageProps.meta.branch}/${pageProps.meta.path}/`} />
                </Head>
            }
            <Component {...pageProps} />
        </>
    );
}

export default MyApp
