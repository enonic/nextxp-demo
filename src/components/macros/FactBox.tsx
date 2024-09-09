import type {MacroProps} from '@enonic/nextjs-adapter';
import React from 'react'

import styles from './FactBox.module.css';
import RichTextView from '@enonic/nextjs-adapter/views/RichTextView';

const FactBox = ({name, config, meta}: MacroProps) => {
    // macro is used inside a <p> tag so we can't use any dom tags
    const header = config.header.length ? config.header : 'Fact Box';
    return <>

        <ins className={styles.factbox}>
            <i className={styles.icon}/>
            <strong className={styles.header}>{header}</strong>
            <RichTextView className={styles.body} data={config.body} meta={meta}></RichTextView>
        </ins>
    </>
};

export default FactBox;

