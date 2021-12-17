import React from "react"
import Region from "../../../xpAdapter/views/_Region";

// fully qualified XP content-type name:
export const LIST_CONTENTTYPE_NAME = `base:folder`;


export const getListQuery = `
query($path:ID!) {                   
  guillotine {
    get(key:$path) {
      type
      displayName
      children(first:1000) {                 
        displayName
        _href: _path
      }
    }
  }
}`;


const ListView = (props) => {

    return (
        <Region {...props} />
    );
};

export default ListView;
