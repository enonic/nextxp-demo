import {MacroProps} from '@enonic/nextjs-adapter';
import React from 'react'
import Link from 'next/link';

const FilmographyMacro = ({name, config, meta}: MacroProps) => {
    // macro is used inside a <p> tag so we can't use any block tags
    const prefix = meta.baseUrl +
        (meta.locale && meta.locale !== meta.defaultLocale ? meta.locale + '/' : '');
    const heading = config.heading || 'Filmography';

    return config.movies.length ?
        <>
            <h4 className={"filmography-heading"}>{heading}</h4>
            <ul>{
                config.movies.map((movie: any, i: number) => (
                    <li className={"filmography-movie"} key={i}>
                        <Link href={prefix + movie._path}>{movie.displayName}</Link>
                    </li>
                ))
            }</ul>
        </> : null
};

export default FilmographyMacro;

