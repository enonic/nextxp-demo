import React from "react"
import Link from "next/link";

type Node = {
    id: string,
    displayName: string,
    name: string
};

type Props = {
    title: string,
    nodes: Node[],
    itemPageRoot?: string
};

const ListPage = ( {title, nodes, itemPageRoot}: Props) => {
    return (
        <>
            <h1>{title}</h1>
            {
                nodes.map((node: Node) => (
                    <div key={node.id}>
                        {
                            itemPageRoot
                                ? (
                                    // @ts-ignore
                                    <Link href={`${itemPageRoot}/${node.name}`}>
                                        <a>{node.displayName}</a>
                                    </Link>
                                ) : (
                                    <span>{node.displayName}</span>
                                )
                        }
                    </div>
                ))
            }
            <br/>
        </>
    )
};

export default ListPage
