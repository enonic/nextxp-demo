import {appKeyUnderscored, appKeyDashed} from '../../../enonic-connection-config'

export default `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      type
      displayName
      _id
      ... on ${appKeyUnderscored}_Person {
        data {
          bio
          dateofbirth
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(500)")
              attachments {
                name
              }
            }
          }
        }
        xAsJson
      }
    }
  }
}`;

export type Photo = {
    // _id: string,
    attachments?: {
        name?: string
    }[]
    imageUrl?: string,
};

export type Person = {
    type: string,
    displayName: string,
    data?: {
        bio?: string,
        dateofbirth?: string,
        photos?: Photo | Photo[]
    },
    xAsJson?: {
        [appKeyDashed: string]: {
            SoMe?: {}
        }
    }
};
