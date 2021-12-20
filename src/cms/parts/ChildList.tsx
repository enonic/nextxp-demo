import React from "react"
import {APP_NAME, getContentLinkUrlFromXpPath} from "../../xpAdapter/enonic-connection-config";
import {PartProps} from './_Part';

// fully qualified XP part name:
export const CHILDLIST_PART_NAME = `${APP_NAME}:child-list`;


const ChildList = ({content}: PartProps) => {
    const {children} = content;

    return children && (
        <ul>{
            children.map((child: any, i: number) => (
                <li key={i}>
                    <a href={getContentLinkUrlFromXpPath(child._path)}>
                        {child.displayName}
                    </a>
                </li>
            ))
        }</ul>
    );
};

export default ChildList;
