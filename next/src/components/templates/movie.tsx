import React from "react"
import Link from "next/link";
import {CastItem, Movie} from "../../shared/data/queries/getMovie";

import { getPhoto} from "../../shared/images";


const getCast = (cast): CastItem[] | undefined => !cast
    ? undefined
    : (Array.isArray(cast))
        ? cast
        : [cast];

const MoviePage = (movie: Movie) => {
    const movieMeta = movie.data || {};

    const moviePhoto = getPhoto(movieMeta.photos);
    const movieCast = getCast(movieMeta.cast);

    return (
        <>
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
                    {
                        moviePhoto &&
                        <img
                            style={{
                                maxWidth: '400px',
                                width: '50%'
                            }}
                            src={moviePhoto.imageUrl}
                            title={movieMeta.subtitle}
                            alt={moviePhoto.alt} />
                    }
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
                                        movieCast &&
                                        movieCast.map(cast => {
                                            if (!cast.actor) {
                                                return undefined
                                            }
                                            const actorData = cast.actor.data || {};
                                            const actorPhoto = getPhoto(actorData.photos);
                                            return (
                                                <div
                                                    key={cast.actor.id}
                                                    style={{
                                                        flex: '1 1 0px',
                                                        display: `flex`,
                                                        flexDirection: `column`
                                                    }}
                                                >
                                                    {
                                                        actorPhoto &&
                                                        <img
                                                            style={{
                                                                width: '50%',
                                                                marginBottom: '0.5rem'
                                                            }}
                                                            src={actorPhoto.imageUrl}
                                                            title={`${cast.actor.displayName} as ${cast.character}`}
                                                            alt={cast.character}
                                                        />
                                                    }
                                                    <div
                                                        style={{
                                                            display: `flex`,
                                                            flexDirection: `column`
                                                        }}>
                                                        <i style={{fontSize: '14px'}}>
                                                            {cast.character}
                                                        </i>
                                                        <Link href={`/persons/${cast.actor.name}`}>
                                                            <a style={{fontSize: '14px'}}>
                                                                {cast.actor.displayName}
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p>
                <Link href='.'>
                    <a>Back to Movies</a>
                </Link>
            </p>
        </>
    )
}

export default MoviePage;
