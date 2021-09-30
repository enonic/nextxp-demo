import React from "react"
import Link from 'next/link'

import { List } from "../../shared/data/queries/getList";
import {getPageUrlFromXpPath, getPublicAssetUrl} from "../../enonic-connection-config";

const ListPage = ( {displayName, children}: List) => {
    console.log("\n\nChildren props:", children);
    return (
        <>
            <img src={getPublicAssetUrl("images/xp-shield.svg")} height={200} width={130} alt="XP shield"/>
            <h1>{displayName}</h1>
            {
                children.map((child, i) => (
                    <div key={i}>
                        <a href={getPageUrlFromXpPath(child._path)}>
                            {child.displayName}
                        </a>
                    </div>
                ))
            }
            <br/>
            <Link href="/"><a>Top</a></Link>
        </>
    )
};

export default ListPage
