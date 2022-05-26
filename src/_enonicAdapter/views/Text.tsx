import React from "react"
import {MetaData, TextData} from '../guillotine/getMetaData';
import RichTextView from './RichTextView';

type Props = {
    meta: MetaData,
    component: TextData,
    data?: any,
}

const DefaultTextView = ({component, data, meta}: Props) => {

    console.log('Text component data');
    console.log(JSON.stringify(data, null, 2));
    // temporary workaround for TextComponent expecting section inside of a root element
    return <div>
        <RichTextView data={component.value} meta={meta}/>
    </div>
};

export default DefaultTextView;
