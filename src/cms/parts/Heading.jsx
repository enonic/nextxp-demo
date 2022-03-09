import React from "react"
import {APP_NAME} from "../../enonicAdapter/enonic-connection-config";

// fully qualified XP part name:
export const HEADING_PART_NAME = `${APP_NAME}:heading`;

const Heading = ({content, part}) => (
    <h2>{part?.config?.heading || content.displayName}</h2>
);

export default Heading;
