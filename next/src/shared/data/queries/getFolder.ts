export default `
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
