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

const apiUrl = "http://localhost:8080/site/hmdb/draft/hmdb/api";

const fetchData = async <T>(query: string) => {
  return await fetch(apiUrl, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  }).then(async (res: Response) => {
    if (!res.ok) {
      throw new Error(
        `Data fetching failed. Error: ${JSON.stringify(await res.json())}`
      );
    }
    return (await res.json()) as T;
  });
};

const fetchChildren = (query: string) =>
  fetchData<RawData>(query).then((res) => res.data.guillotine.getChildren);

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

  return fetchChildren(query).then(withTimestamp);
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

  return fetchChildren(query).then(withTimestamp);
};

type GetQueryResult = {
  data: {
    guillotine: {
      get: Content;
    };
  };
};

export const fetchContent = (id: string): Promise<Content | Error> => {
  const query = `
    {
      guillotine {
        get(key: "${id}") {
          displayName
        }
      }
    }`;
  return fetchData<GetQueryResult>(query).then(
    (res) => res.data.guillotine.get
  );
};
