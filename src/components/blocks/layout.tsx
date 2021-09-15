import React, {FunctionComponent} from "react"

import Link from 'next/link';

import Header from "./header"

type LayoutProps = {
    siteTitle?: string,
    random: number,
    children: any
};

const Layout: FunctionComponent<LayoutProps> = ({siteTitle, random, children}: LayoutProps) => {

    return (
        <>
            <Header siteTitle={siteTitle} random={random} />
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0 1.0875rem 1.45rem`,
                }}
            >
                <main>{children}</main>

                <footer>
                    <br/>
                    © {new Date().getFullYear()}, Built with
                    {` `}
                    <Link href="https://nextjs.org"><a>Next.js</a></Link>
                    {` `}
                    Powered by
                    {` `}
                    <Link href="https://enonic.com"><a>Enonic XP</a></Link>
                </footer>
            </div>
        </>
    )
}

export default Layout;
