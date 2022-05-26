import React from "react"
import {RichTextProcessor} from '../RichTextProcessor';
import {MetaData, RichTextData} from '../guillotine/getMetaData';

type Props = {
    data: RichTextData,
    meta: MetaData,
    tag?: string,
}

const RichTextView = ({tag, data, meta}: Props) => {
    const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
    return <CustomTag dangerouslySetInnerHTML={{__html: RichTextProcessor.process(data, meta)}}/>
}

export default RichTextView;
