// This query is executed for every page rendering.
// Result is included in props.common

export const commonQuery = `
query($path:ID!, $repo: String, $siteKey: String, $branch: String){
  guillotine(siteKey: $siteKey, repo: $repo, branch: $branch) {
    get(key:$path) {
      displayName
      _id
      type
      dataAsJson
      xAsJson
    }
    getSite {
      displayName
      pageUrl
    }
  }
}`;

