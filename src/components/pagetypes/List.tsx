import React from "react"
import Image from 'next/image'
import Link from 'next/link'

import { List } from "../../shared/data/queries/getList";
import {getSiteRelativePath} from "../../shared/siteRelative/siteRelative";

import xpShield from '../../public/images/xp-shield.svg';

const ListPage = ( {displayName, children}: List) => {
    return (
        <>
            <Image src={xpShield} height={200} width={130} alt="XP shield"/>
            <h1>{displayName}</h1>
            {
                children.map((child, i) => (
                    <div key={i}>
                        <a href={getSiteRelativePath(child._path)}>
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
