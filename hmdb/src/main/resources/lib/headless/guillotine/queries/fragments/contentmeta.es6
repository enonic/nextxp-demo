// Query for the first, get-basic-info call that mainly determinines content type of a content item

// TODO: add component data structure (from CS page-builder) into this query?

// TODO: move this to next side, for consistency

exports.DEFAULT_META_QUERY = `
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
