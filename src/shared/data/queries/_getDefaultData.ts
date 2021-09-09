// Catch-all default cet-content-data query (second call for a content item of known content type).
// THIS SCALES BADLY and is not supposed to be used in production!
//
// Data calls, including added overrides, should always return type for verification and cache invalidation.

export const LOW_PERFORMING_DEFAULT_QUERY = `
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
