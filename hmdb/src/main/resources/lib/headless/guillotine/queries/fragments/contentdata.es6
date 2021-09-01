// Catch-all fallback query for the second, get-all-data call for a content item.
// THIS SCALES BADLY and is not supposed to be used in production

// TODO: add component data structure (from CS page-builder) into this query

const DEFAULT_GENERAL_QUERY = `
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

exports.getContentDataQuery = () => {
    // TODO: only warn in production only
    log.warning(`No query was provided, so a catch-all fallback query will be used. This WILL NOT SCALE WELL, so in production it's highly recommended to supply a guillotine query tailored for your content type!`);
    return DEFAULT_GENERAL_QUERY;
}
