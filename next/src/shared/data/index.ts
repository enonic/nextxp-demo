import { apiUrl } from '../../../enonic.connection.config';

type QueryChildrenResult<T> = {
  data: {
    guillotine: {
      getChildren: T;
    };
  };
};

type QueryGetResult<T> = {
    data: {
        guillotine: {
            get: T;
        };
    };
};

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


export const fetchContentChildren = async <T extends any[]> (query: string): Promise<T> =>
  fetchData<QueryChildrenResult<T>>(query)
      .then(res => res.data.guillotine.getChildren);

export const fetchContentItem = async <T> (query: string): Promise<T> =>
    fetchData<QueryGetResult<T>>(query)
        .then(res => res.data.guillotine.get);
