import getMoviesQuery from './queries/getMovies';
import getPersonsQuery from './queries/getPersons';
import getMovieQuery from './queries/getMovie';
import getPersonQuery from './queries/getPerson';

//import makeGetContentQuery from './queries/getContent';

import { apiUrl, appNameUnderscored } from './config';

type RawData = {
  data: {
    guillotine: {
      getChildren: Content[];
    };
  };
};

type GetQueryResult = {
    data: {
        guillotine: {
            get: Content;
        };
    };
};

export type Content = {
  displayName: string;
  _path: string;s
};

export type DataList = {
  contentList: Content[];
  timestamp: string;
};
export type DataItem = {
    content: Content;
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

const timestampList = async (data: Content[]) => ({
    contentList: data,
    timestamp: new Date().toISOString(),
});
const timestampItem = async (data: Content) => ({
    content: data,
    timestamp: new Date().toISOString(),
});

const fetchTimestampedChildren = async (query: string): Promise<DataList> =>
  fetchData<RawData>(query)
      .then(res => res.data.guillotine.getChildren)
      .then(timestampList);

const fetchTimestampedItem = async (query: string): Promise<DataItem> =>
    fetchData<GetQueryResult>(query)
        .then(res => res.data.guillotine.get)
        .then(timestampItem);


const moviesQuery = getMoviesQuery(appNameUnderscored);
export const fetchMovies = async (): Promise<DataList> => fetchTimestampedChildren(moviesQuery);

const personsQuery = getPersonsQuery(appNameUnderscored);
export const fetchPersons = async (): Promise<DataList> => fetchTimestampedChildren(personsQuery);

export const fetchPerson = async (personSubPath): Promise<DataItem> => {
    const personQuery = getPersonQuery(appNameUnderscored, personSubPath);
    return fetchTimestampedItem(personQuery);
}

export const fetchMovie = async (personSubPath): Promise<DataItem> => {
    const movieQuery = getMovieQuery(appNameUnderscored, personSubPath);
    return fetchTimestampedItem(movieQuery);
}
/*

export const fetchContent = (pathOrId: string): Promise<Content | Error> => fetchData<GetQueryResult>(makeGetContentQuery(pathOrId))
    .then((res) => res.data.guillotine.get);
*/
