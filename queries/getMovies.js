const query = `{
  guillotine {
    query(contentTypes: "com.example.myproject:movie", query: "valid='true'", sort: "displayName") {
      id: _id
      displayName
      name: _name
      ... on com_example_myproject_Movie {
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
              ... on com_example_myproject_Person {
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
}`

module.exports = query;
