// Catch-all fallback query for the second, get-all-data call for a content item.
// THIS SCALES BADLY and is not supposed to be used in production

// TODO: worth moving to the nextJS side? Consequences for error handling, and common code with contentMeta, might be a big refactor. Worth it?

// TODO: add component data structure (from CS page-builder) into this query

const GENERAL_QUERY_CHILDLESS = `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      _id
      _path
      displayName
      type
      dataAsJson
      xAsJson
    }
  }
}`;

const GENERAL_QUERY_WITH_CHILDREN = `
query($idOrPath:ID!, $maxChildren:Int!){
  guillotine {
    get(key:$idOrPath) {
      _id
      _path
      displayName
      type
      dataAsJson
      xAsJson
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

exports.getContentDataQuery = (maxChildren) => {
    // TODO: only warn in dev mode? Or only once?
    log.warning(`No query was provided, so a catch-all fallback query will be used. This WILL NOT SCALE WELL, so in production it's highly recommended to supply a guillotine query tailored for your content type!`);
    return (maxChildren > 0)
        ? GENERAL_QUERY_WITH_CHILDREN
        : GENERAL_QUERY_CHILDLESS
}
