import {Person, Photo} from "./getPerson";

import {appKeyUnderscored, appKeyDashed} from '../../../enonic-connection-config'

export default `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      type
      displayName
      ... on ${appKeyUnderscored}_Movie {
        data {
          subtitle
          abstract
          trailer
          release
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(500)")
              attachments {
                name
              }
            }
          }
          cast {
            character
            actor {
              ... on ${appKeyUnderscored}_Person {
                _path
                displayName
                data {
                  photos {
                    ... on media_Image {
                      imageUrl: imageUrl(type: absolute, scale: "block(100,100)")
                      attachments {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        xAsJson
      }
    }
  }
}`;


export type CastItem = {
    character?: string,
    actor?: Person & { _path: string }
};

export type Movie = {
    type: string,
    displayName: string,
    data?: {
        subtitle?: string,
        abstract?: string,
        trailer?: string,
        release?: string,
        photos?: Photo | Photo[],
        cast?: CastItem | CastItem[]
    },
    xAsJson?: {
        [appKeyDashed: string]: {
            SoMe?: {}
        }
    }
};
