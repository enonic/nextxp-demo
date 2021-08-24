import React from "react"
import Link from "next/link";

type Node = {
    id: string,
    displayName: string
};

type ListPageProps = {
    title: string,
    nodes: Node[],
    detailsPageUrl?: string
    detailsPageKey: string,
};

const ListPage = ({title, nodes, detailsPageKey, detailsPageUrl}: ListPageProps) => {
    return (
        <>
            <h1>{title}</h1>
            {
                nodes.map((node: Node) => (
                    <div key={node.id}>
                        {
                            detailsPageUrl
                                ? (
                                    // @ts-ignore
                                    <Link href={`${detailsPageUrl}/${node[detailsPageKey]}`}>
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
