export default (underscoredAppName) => `
{
  guillotine {
    getChildren(key: "\${site}/persons") {
      ... on ${underscoredAppName}_Person {
        id: _id
        displayName
        name: _name
        data {
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(250)")
              id: _id
              attachments {
                altName: name
              }
            }
          }
        }
      }
    }
  }
}`;

import { BasePerson } from "./getPerson";

export type PersonList = BasePerson[];
