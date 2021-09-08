import React from "react"
import Link from "next/link";

import { Folder } from "../../shared/data/queries/getFolder";


const FolderPage = ( folder: Folder) => {
    return (
        <>
            <p>Folder:</p>
            <h2>{folder.displayName}</h2>
            <ul>
                {folder.children.map(child => (
                    <li key={child._id}>
                        <Link href={child._path.substring(1)}><a>{child.displayName}</a></Link>
                    </li>)
                )}
            </ul>
            <pre>{JSON.stringify(folder, null, 2)}</pre>
        </>
    )
};

export default FolderPage
