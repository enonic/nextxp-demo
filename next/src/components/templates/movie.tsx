import React from "react"
import Layout from "../blocks/layout"
import SEO from "../blocks/seo"
import Link from "next/link";

import type { Photo } from './person';

type MovieCast = {
    character: string,
    actor: {
        id: string,
        displayName: string,
        name: string,
        data: {
            photos: {
                imageUrl: string
            }[]
        }
    }
};


type Movie = {
    displayName: string,
    data: {
        release?: string,
        subtitle: string,
        abstract: string,
        cast?: MovieCast[],
        photos: Photo[],
    }
};

type MoviePageContext = {
    node: Movie,
    listPageUrl: string,
    title?: string,
}

type MoviePageProps = {
    pageContext: MoviePageContext
};


const getPageTitle = (pageContext: MoviePageContext) => {
    const node = pageContext.node;

    // @ts-ignore
    if (!!node && pageContext.title && (node[pageContext.title] || node.data[pageContext.title])) {
        // @ts-ignore
        return node[pageContext.title] || node.data[pageContext.title];
    }

    return pageContext.title || 'Person';
};


const MoviePage = ({pageContext}: MoviePageProps) => {
    const movie = pageContext.node;
    const movieMeta = movie.data;

    return (
        <Layout>
            <SEO title={getPageTitle(pageContext)}/>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline'
                }}>
                    <h2>{movie.displayName}
                        {movieMeta.release && (
                            <i style={{
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontSize: '24px',
                                marginLeft: '10px',
                                opacity: '0.7'
                            }}>({new Date(movieMeta.release).getFullYear()})</i>
                        )}
                    </h2>
                </div>
                <div style={{
                    display: `flex`
                }}>
                    <img
                        style={{
                            maxWidth: '400px',
                            width: '50%'
                        }}
                        src={movieMeta.photos[0].imageUrl} title={movieMeta.subtitle}
                        alt={movieMeta.photos[0].attachments[0].imageText}/>
                    <div style={{
                        margin: `0 20px`
                    }}>
                        <p><i>{movieMeta.abstract}</i></p>
                        {movieMeta.cast && (
                            <>
                                <h4>Cast</h4>
                                <div style={{
                                    display: `flex`,
                                    padding: '0 15px'
                                }}>
                                    {
                                        movieMeta.cast.map(cast => (
                                            <div
                                                key={cast.actor.id}
                                                style={{
                                                    flex: '1 1 0px',
                                                    display: `flex`,
                                                    flexDirection: `column`
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        width: '50%',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                    src={cast.actor.data.photos[0].imageUrl}
                                                    title={`${cast.actor.displayName} as ${cast.character}`}
                                                    alt={cast.character}/>
                                                <div
                                                    style={{
                                                        display: `flex`,
                                                        flexDirection: `column`
                                                    }}>
                                                    <i style={{fontSize: '14px'}}>
                                                        {cast.character}
                                                    </i>
                                                    <Link href={`persons/${cast.actor.name}`}>
                                                        <a style={{fontSize: '14px'}}>
                                                            {cast.actor.displayName}
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p>
                <Link href={`${pageContext.listPageUrl}`}>
                    <a>Back to Movies</a>
                </Link>
            </p>
        </Layout>
    )
}

export default MoviePage
