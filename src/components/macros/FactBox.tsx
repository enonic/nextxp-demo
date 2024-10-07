import type {MacroProps} from '@enonic/nextjs-adapter';
import React from 'react'

import styles from './FactBox.module.css';

const FactBox = ({name, children, config, meta}: MacroProps) => {
    // macro is used inside a <p> tag so we can't use any dom tags
    const header = config.header.length ? config.header : 'Fact Box';
    return <>

        <ins className={styles.factbox}>
            <i className={styles.icon}/>
            <strong className={styles.header}>{header}</strong>
            {children}
        </ins>
    </>
};

export default FactBox;

