type RawData = {
  data: {
    guillotine: {
      getChildren: Content[];
    };
  };
};

export type Content = {
  displayName: string;
  _path: string;
};

export type DataList = {
  contentList: Content[];
  timestamp: string;
};

const fetchData = async (query: string) => {
  const url = "http://localhost:8080/site/hmdb/draft/hmdb/api";

  return await fetch(url, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  })
    .then(async (res: Response) => {
      if (!res.ok) {
        throw new Error(`Data fetching failed. Error: ${JSON.stringify(await res.json())}`);
      }
      return (await res.json()) as RawData;
    })
    .then((res) => res.data.guillotine.getChildren);
};

const withTimestamp = async (data: Content[]) => ({
  contentList: data,
  timestamp: new Date().toISOString(),
});

export const fetchMovies = async (): Promise<DataList> => {
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

  return fetchData(query).then(withTimestamp);
};

export const fetchPeople = async (): Promise<DataList> => {
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

  return fetchData(query).then(withTimestamp);
};
