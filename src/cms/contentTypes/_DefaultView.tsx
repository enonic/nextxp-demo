import React from "react"

import {IS_DEV_MODE} from "../../xpAdapter/enonic-connection-config";

import {PageData} from "../../xpAdapter/guillotine/fetchContent";
import RegionsView from '../../xpAdapter/views/_Region';
import DataDump from "../../xpAdapter/views/DataDump";
import Empty from "../../xpAdapter/views/Empty";

type ContentProps = {
    displayName: string,
}

type Props = {
    content: ContentProps,
    page?: PageData
}
const DefaultViewDev = ({ content, page }: Props) => {
    return (
        <div style={{padding: "10px"}}>
            <h2>{content.displayName}</h2>
            <DataDump label="content" data={content} />
            <br />
            <RegionsView regions={page?.regions} content={content}/>
            <br />
            <p style={{fontSize: ".7em", color: "#bbb"}}>_DefaultView.tsx</p>
        </div>
    )
}

const DefaultView = IS_DEV_MODE
    ? DefaultViewDev
    : Empty;

export default DefaultView;
