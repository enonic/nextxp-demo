export default (underscoredAppName, personSubPath) => `
{
  guillotine {
    get(key: "\${site}/persons/${personSubPath}") {
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
