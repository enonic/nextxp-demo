import React from "react"
import {CastItem, Movie} from "../../shared/data/queries/getMovie";

import styles from "../../styles/Home.module.css";

import {getFirstPhotoData} from "../../shared/images/images";
import {getPageUrlFromXpPath} from "../../enonic-connection-config";


const getCast = (cast: CastItem | CastItem[] | undefined): CastItem[] | undefined => !cast
    ? undefined
    : (Array.isArray(cast))
        ? cast
        : [cast];

const MoviePage = (movie: Movie) => {
    // console.log("\n\nMovie props:", movie);

    const movieMeta = movie.data || {};

    const moviePhoto = getFirstPhotoData(movieMeta.photos);
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
                        moviePhoto && moviePhoto.imageUrl &&
                        <img src={moviePhoto.imageUrl}
                               title={movieMeta.subtitle}
                               alt={moviePhoto.alt}
                               className={styles.mainPhoto}/>
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
                                        movieCast.map((cast, i) => {
                                            if (!cast.actor) {
                                                return undefined
                                            }
                                            const actorData = cast.actor.data || {};
                                            const actorPhoto = getFirstPhotoData(actorData.photos);
                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        display: `flex`,
                                                        flexDirection: `column`
                                                    }}
                                                >
                                                    {
                                                        actorPhoto && actorPhoto.imageUrl &&
                                                        <img src={actorPhoto.imageUrl}
                                                             title={`${cast.actor.displayName} as ${cast.character}`}
                                                             alt={cast.character}
                                                             className={styles.castPhoto} />
                                                    }
                                                    <div
                                                        style={{
                                                            display: `flex`,
                                                            flexDirection: `column`
                                                        }}>
                                                        <i style={{fontSize: '14px'}}>
                                                            {cast.character}
                                                        </i>
                                                        <a href={getPageUrlFromXpPath(cast.actor._path)} style={{fontSize: '14px'}}>
                                                                {cast.actor.displayName}
                                                            </a>
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
                <a href={getPageUrlFromXpPath(movie.parent._path)}>Back to Movies</a>
            </p>
        </>
    )
}

export default MoviePage;
