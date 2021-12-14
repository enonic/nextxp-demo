import React from "react"

import {PageData} from "../../xpAdapter/guillotine/fetchContent";
import RegionsView from '../../xpAdapter/views/_Region';

type ContentProps = {
    displayName: string,
}

type Props = {
    content: ContentProps,
    page?: PageData
}


const DefaultView = (props: Props) => {
    const { content } = props;
    return (
        <div style={{padding: "10px"}}>
            <h2>{content.displayName}</h2>
            <h5>content:</h5>
            <pre style={{fontSize: ".8em", width:"100%", whiteSpace:"pre-wrap", wordWrap: "break-word"}}>{JSON.stringify(content, null, 2)}</pre>
            <br />
            <RegionsView regions={props.page?.regions} content={props.content}/>
            <br />
            <p style={{fontSize: ".7em", color: "#bbb"}}>Renderer: _Default.tsx</p>
        </div>
    )
}

export default DefaultView;
