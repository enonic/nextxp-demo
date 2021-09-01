// Query for the first, get-basic-info call that mainly determinines content type of a content item

// TODO: add component data structure (from CS page-builder) into this query?

const DEFAULT_BASE_QUERY_CHILDLESS = `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      _id
      _path
      displayName
      type
    }
  }
}`;

const DEFAULT_BASE_QUERY = `
query($idOrPath:ID!, $maxChildren:Int!){
  guillotine {
    get(key:$idOrPath) {
      _id
      _path
      displayName
      type
      ...on base_Folder {
        children(first:$maxChildren) {
            _id
            displayName
            _path
            type
        }
      }
    }
  }
}`;

exports.getContentBaseQuery = (maxChildren) => (maxChildren > 0)
    ? DEFAULT_BASE_QUERY
    : DEFAULT_BASE_QUERY_CHILDLESS
