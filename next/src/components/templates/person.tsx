import React from "react"
import Link from "next/link";

type Photo = {
    imageUrl: string,
    attachments: {
        imageText?: string
        altImageText?: string
    }[]
};

export type {Photo};

type PersonData = {
    bio: string,
    photos: Photo[]
};

type Person = {
    displayName: string,
    data: PersonData
}

type PersonPageContext = {
    title: string,
    listPageUrl: string,
    node: Person
}

type PersonPageProps = {
    pageContext: PersonPageContext
}

const getPageTitle = ({node, title}: PersonPageContext) => {

    // @ts-ignore
    if (!!node && pageContext.title && (node[pageContext.title] || node.data[pageContext.title])) {
        // @ts-ignore
        return node[pageContext.title] || node.data[pageContext.title];
    }

    return title || 'Person';
};

const PersonPage = ({pageContext}: PersonPageProps) => {
    const person = pageContext.node;
    const personMeta = person.data;

    return (
        <>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline'
                }}>
                    <h2>{person.displayName}</h2>
                </div>
                <div style={{
                    display: `flex`
                }}>
                    <img
                        style={{
                            maxWidth: '400px',
                            width: '50%'
                        }}
                        src={personMeta.photos[0].imageUrl} title={person.displayName}
                        alt={personMeta.photos[0].attachments[0].altImageText}/>
                    <p style={{
                        margin: `0 20px`
                    }}><i>{personMeta.bio}</i></p>
                </div>
            </div>
            <p>
                <Link href={`${pageContext.listPageUrl}`}>
                    <a>Back to Persons</a>
                </Link>
            </p>
        </>
    )
}

export default PersonPage
