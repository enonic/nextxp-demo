import { apiUrl } from './config';

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

export type Content = {
  displayName: string;
  _path: string;
};

export type Timestamped<T> = {
    content: T;
    timestamp: string;
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

const timestamp = async <T> (data: T) => ({
    content: data,
    timestamp: new Date().toISOString(),
});

export const fetchContentChildren = async <T extends any[]> (query: string): Promise<Timestamped<T>> =>
  fetchData<QueryChildrenResult<T>>(query)
      .then(res => res.data.guillotine.getChildren)
      .then(timestamp);

export const fetchContentItem = async <T> (query: string): Promise<Timestamped<T>> =>
    fetchData<QueryGetResult<T>>(query)
        .then(res => res.data.guillotine.get)
        .then(timestamp);
