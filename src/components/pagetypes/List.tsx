import React from "react"

import { List } from "../../shared/data/queries/getList";

const ListPage = ( {displayName, children}: List) => {
    return (
        <>
            <h1>{displayName}</h1>
            {
                children.map((child, i) => (
                    <div key={i}>
                        <a href={child._path}>
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
