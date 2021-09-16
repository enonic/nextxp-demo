import {Person} from "./getPerson";
import {Photo} from "./getPhoto";

import {appKeyUnderscored} from '../../../enonic-connection-config'

import getPhoto from "./getPhoto";

export default `
query($path:ID!){
  guillotine {
    get(key:$path) {
      type
      displayName
      ... on ${appKeyUnderscored}_Movie {
        data {
          subtitle
          abstract
          trailer
          release
          photos {
            ${getPhoto('width(500)')}
          }
          cast {
            character
            actor {
              ... on ${appKeyUnderscored}_Person {
                _path
                displayName
                data {
                  photos {
                    ${getPhoto('block(100,100)')}
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
