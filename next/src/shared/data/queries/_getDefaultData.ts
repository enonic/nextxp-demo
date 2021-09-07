// Catch-all default cet-content-data query (second call for a content item of known content type).
// THIS SCALES BADLY and is not supposed to be used in production!
//
// Data calls, including added overrides, should always return type for verification and cache invalidation.

// TODO: worth moving to the nextJS side? Consequences for error handling, and common code with contentMeta, might be a big refactor. Worth it?

// TODO: add component data structure (from CS page-builder) into this query

export default `
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
