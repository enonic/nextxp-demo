const query = `{
  guillotine {
    query(contentTypes: "com.example.myproject:person", query: "valid='true'", sort: "displayName", first: 100) {
      id: _id
      displayName
      name: _name
      ... on com_example_myproject_Person {
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
}`

module.exports = query;