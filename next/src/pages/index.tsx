import Image from "next/image";

import xpShield from '../public/images/xp-shield.svg';
import React from "react";

export default function Home() {
    return (
        <div>
            <main>
                <h1>Enonic ❤ Next.js</h1>
                <p>Welcome to the Enonic XP + <a href="https://nextjs.org">Next.js</a> proof of concept!</p>

                <Image src={xpShield}
                       width={156}
                       height={300}
                       alt={"Enonic XP logo"}
                />

                <section>
                    <h2>Browsing</h2>
                    <p>If this app is hooked up to a running XP instance
                        (see <em>src/enonic-connection-config.js</em>), you can already browse content item data in
                        this app. Go to the <pre style={{display: 'inline'}}>_path</pre> of a content item:
                    </p>
                    <p>/_draft/<em>&lt;site/path/to/item&gt;</em></p>
                    <p>Of course, just replace '_draft' with '_master' to view published content.</p>
                </section>

                <section>
                    <h2>Get started</h2>
                    <p>The data browsing is a general view that uses a generic guillotine query and shared react component. Check out <strong
                        style={{color: 'green'}}>the docs</strong> for how to tailor your own queries and react
                        components to fetch and render content from XP, by content type.</p>
                </section>
            </main>
        </div>
    );
}
