export default `
query($idOrPath:ID!, $maxChildren:Int!){
  guillotine {
    get(key:$idOrPath) {
      displayName
      type
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

export type ChildContent = {
    displayName: string,
    _path: string,
    _id: string,
    type: string
};

export type Folder = {
    displayName: string,
    children: ChildContent[],
    type: string
};
