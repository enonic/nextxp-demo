import { apiUrlDraft, apiUrlMaster } from '../../../enonic.connection.config';


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

const fetchData = async <T>(query: string, isDraft?: boolean) => {
  const apiUrl = isDraft ? apiUrlDraft : apiUrlMaster;
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


export const fetchContentChildren = async <T extends any[]> (query: string, isDraft?: boolean): Promise<T> =>
  fetchData<QueryChildrenResult<T>>(query, isDraft)
      .then(res => res.data.guillotine.getChildren);

export const fetchContentItem = async <T> (query: string, isDraft?: boolean): Promise<T> =>
    fetchData<QueryGetResult<T>>(query, isDraft)
        .then(res => res.data.guillotine.get);
