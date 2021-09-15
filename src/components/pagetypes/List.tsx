import React from "react"
import Link from "next/link";

import { List } from "../../shared/data/queries/getList";

const ListPage = ( {displayName, children}: List) => {
    return (
        <>
            <h1>{displayName}</h1>
            {
                children.map((child, i) => (
                    <div key={i}>
                        <Link href={child._path.substring(1)}>
                            <a>{child.displayName}</a>
                        </Link>
                    </div>
                ))
            }
            <br/>
        </>
    )
};

export default ListPage
