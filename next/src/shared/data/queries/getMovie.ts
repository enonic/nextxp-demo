import {BasePerson, Photo} from "./getPerson";
import {ExportBatchSpecifierKind} from "ast-types/gen/kinds";

export default (underscoredAppName, movieSubPath) => `
{
  guillotine {
    get(key: "\${site}/movies/${movieSubPath}") {
      ... on ${underscoredAppName}_Movie {
        id: _id
        displayName
        name: _name
        data {
          subtitle
          abstract
          trailer
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
              ... on ${underscoredAppName}_Person {
                id: _id
                name: _name
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
      }
    }
  }
}`;


export type CastItem = {
    character?: string,
    actor?: BasePerson,
};

export type BaseMovie = {
    id: string,
    displayName: string,
    name: string,
    data?: {
        photos?: Photo | Photo[]
    },
};

export type Movie = Omit<BaseMovie, 'data'> & {
    data?: {
        subtitle?: string,
        abstract?: string,
        trailer?: string,
        release?: string,
        photos?: Photo | Photo[],
        cast?: CastItem | CastItem[]
    }
};
