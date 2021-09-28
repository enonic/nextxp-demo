import {appKeyUnderscored, appKeyDashed} from '../../../enonic-connection-config'

import getPhoto, {Photo} from "./getPhoto";

export default `
query($path:ID!){
  guillotine {
    get(key:$path) {
      type
      displayName
      _id
      ... on ${appKeyUnderscored}_Person {
        data {
          bio
          dateofbirth
          photos {
            ${getPhoto('width(500)')}
          }
        }
        parent {
            _path
        }
        xAsJson
      }
    }
  }
}`;


export type Person = {
    type: string,
    displayName: string,
    data?: {
        bio?: string,
        dateofbirth?: string,
        photos?: Photo | Photo[]
    },
    parent: any,
    xAsJson?: {}
};
