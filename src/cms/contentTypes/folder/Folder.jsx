import React from "react"
import Region from "../../../xpAdapter/views/_Region";

// fully qualified XP content-type name:
export const FOLDER_CONTENTTYPE_NAME = `base:folder`;


export const getFolderQuery = `
query($path:ID!) {                   
  guillotine {
    get(key:$path) {
      type
      displayName
      children(first:1000) {                 
        displayName
        _path
      }
    }
  }
}`;


const FolderView = (props) => (
    <Region regions={props.page?.regions}
            content={props.content}
            name="main"
    />
);


export default FolderView;
