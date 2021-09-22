export default `
query($path:ID!){
  guillotine {
    get(key:$path) {
      type
      displayName
      ...on base_Folder {
        children(first:1000) {
            displayName
            _path
            _name
        }
      }
    }
  }
}`;

export type Child = {
    displayName: string,
    _path: string,
    _name: string
}

export type List = {
    displayName: string,
    children: Child[]
};
