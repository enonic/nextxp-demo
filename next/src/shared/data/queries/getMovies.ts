export default (underscoredAppName) => `
{
  guillotine {
    getChildren(key: "\${site}/movies") {
      ... on ${underscoredAppName}_Movie {
        id: _id
        displayName
        name: _name
        data {
          subtitle
          abstract
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(300)")
              attachments {
                imageText: name
              }
            }
          }
          cast {
            character
            actor {
              id: _id
              name: _name
              displayName
              ... on ${underscoredAppName}_Person {
                data {
                  photos {
                    ... on media_Image {
                      imageUrl: imageUrl(type: absolute, scale: "block(100,100)")
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
