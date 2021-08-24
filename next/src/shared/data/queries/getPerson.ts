export default (underscoredAppName, personSubPath) => `
{
  guillotine {
    get(key: "\${site}/persons/${personSubPath}") {
      ... on ${underscoredAppName}_Person {
        id: _id
        displayName
        name: _name
        data {
          bio
          dateofbirth
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(500)")
              id: _id
              attachments {
                altName: name
              }
            }
          }
        }
      }
    }
  }
}`;

type Photo = {
    id: string,
    attachments?: {
        altName?: string
    }[]
    imageUrl?: string,
};

export type BasePerson = {
    id: string,
    displayName: string,
    name: string,
    data?: {
        photos?: Photo | Photo[]
    },
};

export type Person = Omit<BasePerson, 'data'> & {
    data?: {
        bio?: string,
        dateofbirth?: string,
        photos?: Photo | Photo[]
    }
};
