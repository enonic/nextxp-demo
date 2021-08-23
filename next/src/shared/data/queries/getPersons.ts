export default (underscoredAppName) => `
{
  guillotine {
    getChildren(key: "\${site}/persons") {
      ... on ${underscoredAppName}_Person {
        id: _id
        displayName
        name: _name
        data {
          bio
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(300)")
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

