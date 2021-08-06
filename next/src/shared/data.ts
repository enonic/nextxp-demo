type RawData = {
  data: {
    guillotine: {
      getChildren: Data[];
    };
  };
};

type Data = {
  displayName: string;
  _path: string;
};

const fetchData = async (query: string) => {
  const url = "http://localhost:8080/site/hmdb/draft/hmdb/api";

  return await fetch(url, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  })
    .then((res: any) => res.json() as Promise<RawData>)
    .then((res) => res.data.guillotine.getChildren);
};

export const fetchMovies = async (): Promise<Data[]> => {
  const query = `
    {
      guillotine {
        getChildren(key: "\${site}/movies") {
          displayName
          _path
        }
      }
    }
  `;

  return fetchData(query);
};

export const fetchPeople = async (): Promise<Data[]> => {
  const query = `
    {
      guillotine {
        getChildren(key: "\${site}/persons") {
          displayName
          _path
        }
      }
    }
  `;

  return fetchData(query);
};
