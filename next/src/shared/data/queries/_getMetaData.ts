const RICH_META_QUERY = `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      _id
      _path
      displayName
      type
    }
  }
}`;

type RichMeta = {
    _id: string,
    _path: string,
    displayName: string,
    type: string
};



const LEAN_META_QUERY = `
query($idOrPath:ID!){
  guillotine {
    get(key:$idOrPath) {
      type
    }
  }
}`;

type LeanMeta = {
    type: string
};



export default LEAN_META_QUERY;
export type Meta = LeanMeta;
