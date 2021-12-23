import React from "react"
import Region from "../../enonicAdapter/views/_Region";

// fully qualified XP content-type name:
export const FOLDER_CONTENTTYPE_NAME = `base:folder`;


export const folderQuery = `
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
    <Region {...props} name="main" />
);


export default FolderView;
