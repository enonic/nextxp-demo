// Query for the first, get-basic-info call that mainly determinines content type of a content item

// TODO: add component data structure (from CS page-builder) into this query?

const DEFAULT_BASE_QUERY = `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      _id
      displayName
      type
      ...on base_Folder {
        children(first:100) {
            _id
            displayName
            _path
        }
      }
    }
  }
}`;

exports.DEFAULT_BASE_QUERY = DEFAULT_BASE_QUERY;
