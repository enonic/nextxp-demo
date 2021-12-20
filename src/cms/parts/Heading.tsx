import React from "react"
import {APP_NAME} from "../../xpAdapter/enonic-connection-config";
import {PartProps} from './_Part';

// fully qualified XP part name:
export const HEADING_PART_NAME = `${APP_NAME}:heading`;

const Heading = ({content, part}: PartProps) => (
    <h2>{part?.config?.heading || content.displayName}</h2>
);

export default Heading;
