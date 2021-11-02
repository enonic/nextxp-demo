/** Default get-content-data query for a content item at an XP path: $path
 *  (second call for a content item, usually of known content type, but type doesn't matter for this fallback query).
 *  THIS (dataAsJson and xAsJson) SCALES BADLY and is not intended to be used in production
 *  - it's recommended to write custom queries instead and use eg. typeSelector.
 *
 *  Data calls, including added overrides, should ideally always return type (for verification and cache invalidation). */
export const LOW_PERFORMING_DEFAULT_QUERY = `
query($path:ID!){
  guillotine {
    get(key:$path) {
      type
      _id
      displayName
      data: dataAsJson
      x: xAsJson
    }
  }
}`;
