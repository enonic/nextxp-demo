import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'


function MyApp({ Component, pageProps }: AppProps) {
    let host = pageProps.__host;


    if (host) {
        delete pageProps.__host;

    } else if ('undefined' !== typeof window) {
        console.log('Hostin?');
        const urlParams = new URLSearchParams(window.location.search);
        // @ts-ignore
        if (urlParams && urlParams.get('__fromXp__') !== undefined) {
            console.log('Hostin')
            host = window.location.origin;
        }
    }

    console.log(host);

    if (host) {
        return <>
            <Head>
                <base href={host} />
            </Head>
            <Component {...pageProps} />
        </>;

    } else {
        return <Component {...pageProps} />
    }
}

export default MyApp
