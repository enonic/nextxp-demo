const getMainPage = `
query($path:ID!, $repo: String, $siteKey: String, $branch: String) {
  guillotine(siteKey: $siteKey, repo: $repo, branch: $branch) {
    getSite {
      displayName
    }
  }
}`;

export default getMainPage;
