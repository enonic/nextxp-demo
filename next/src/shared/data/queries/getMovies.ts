import {BaseMovie} from "./getMovie";

export default (underscoredAppName) => `
{
  guillotine {
    getChildren(key: "\${site}/movies") {
      ... on ${underscoredAppName}_Movie {
        id: _id
        displayName
        name: _name
        data {
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(250)")
              attachments {
                imageText: name
              }
            }
          }
        }
      }
    }
  }
}`;

export type MovieList = BaseMovie[];
