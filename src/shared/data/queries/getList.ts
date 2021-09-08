export default `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      type
      displayName
      ...on base_Folder {
        children(first:1000) {
            displayName
            _path
        }
      }
    }
  }
}`;

export type Child = {
    displayName: string,
    _path: string
}

export type List = {
    displayName: string,
    children: Child[]
};
