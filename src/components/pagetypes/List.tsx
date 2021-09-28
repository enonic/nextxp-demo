import React from "react"

import { List } from "../../shared/data/queries/getList";
import {getSiteRelativePath} from "../../shared/siteRelative/siteRelative";

const ListPage = ( {displayName, children}: List) => {
    return (
        <>
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
        </>
    )
};

export default ListPage
