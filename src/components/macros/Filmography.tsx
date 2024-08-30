import type {MacroProps} from '@enonic/nextjs-adapter';
import React from 'react'

const FilmographyMacro = ({name, config, meta}: MacroProps) => {
    // macro is used inside a <p> tag so we can't use any dom tags
    return <>
        <ins>
            {[].concat(config.heading).map(val => <strong key={val}>{val}</strong>)}
        </ins>
    </>
};

export default FilmographyMacro;

