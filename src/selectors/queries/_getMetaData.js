// Default get-meta-data query (first call for any content item, fetches content type for the second call) for a content item at XP path $path.

export default `
query($path:ID!){
  guillotine {
    get(key:$path) {
      type
    }
  }
}`;
