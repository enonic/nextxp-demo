import React from "react"
import Link from "next/link";

type ChildContent = {
    displayName: string,
    _path: string,
    _id: string
};

type Props = {
    displayName: string,
    children: ChildContent[],
};

const FolderPage = ( props: Props) => {
    return (
        <>
            <p>Folder:</p>
            <h2>{props.displayName}</h2>
            <ul>
                {props.children.map(child => (
                    <li key={child._id}>
                        <Link href={child._path.substring(1)}><a>{child.displayName}</a></Link>
                    </li>)
                )}
            </ul>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </>
    )
};

export default FolderPage
