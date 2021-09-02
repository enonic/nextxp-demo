import Head from "next/head";
import { useState } from "react";
import * as React from "react";

import {PersonList} from "../../../shared/data/queries/getPersons";
import {MovieList} from "../../../shared/data/queries/getMovies";
import {fetchContentBase} from "../../[[...contentPath]]";
//import {fetchPersons} from "../../persons";
//import {fetchMovies} from "../../movies";


export type Timestamped<T> = {
    data: T
    timestamp: string;
};
const timestamp = async <T> (data: T): Promise<Timestamped<T>> => ({
    data,
    timestamp: new Date().toISOString(),
});



/*export const fetchStampedPersons = async (): Promise<Timestamped<PersonList>> => {
    const persons: PersonList = await fetchPersons();
    return await timestamp(persons);
}
export const fetchStampedMovies = async (): Promise<Timestamped<MovieList>> => {
    const movies: MovieList = await fetchMovies();
    return await timestamp(movies);
}*/

const Page: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Client-side: Next.js data poc</title>
      </Head>
      <h1>Client-side</h1>
      <p>
        This page contains dynamically rendered data. To fetch (or refetch)
        data, click the appropriate button below.
      </p>
      <DataDisplay fetchData={()=>fetchContentBase(['hmdb', 'persons', 'keanu-reeves'])} sectionName={"People"} />
      <DataDisplay fetchData={()=>fetchContentBase(['hmdb', 'movies', 'the-matrix'])} sectionName={"Movies"} />
    </div>
  );
};

type DataList = PersonList | MovieList;

type DataDisplayProps = {
  fetchData: () => Promise<Timestamped<DataList>>;
  sectionName: string;
};

type RemoteData =
  | { status: "NotAsked"; data: undefined, timestamp: undefined }
  | { status: "Loading"; data?: DataList, timestamp: undefined }
  | { status: "Success"; data: DataList, timestamp: string }
  | { status: "Error"; message: string; data?: DataList, timestamp: undefined };

const DataDisplay: React.FC<DataDisplayProps> = ({
  fetchData,
  sectionName,
}) => {
  const [remoteData, setRemoteData] = useState<RemoteData>({
    status: "NotAsked",
    data: undefined,
    timestamp: undefined
  });

  const getData = () => {
    setRemoteData({ status: "Loading", data: remoteData.data, timestamp: undefined});
    fetchData()
      .then((data) => {
        setRemoteData({ status: "Success", data: data.data, timestamp: data.timestamp });
      })
      .catch((err) => {
        setRemoteData({
          status: "Error",
          message: err.message,
          data: remoteData.data,
          timestamp: undefined
        });
      });
  };

  return (
    <section>
      <h2>{sectionName}</h2>
      <button onClick={getData} disabled={remoteData.status === "Loading"}>
        Fetch data!
      </button>
      {remoteData.status === "Error" && (
        <p>
          There was an error when fetching data, but there may still be some
          data displayed below. The error was: {remoteData.message}
        </p>
      )}
      {!remoteData.data ? (
        <p>There is no data available right now. How about fetching some?</p>
      ) : (
        <>
            {
                remoteData.timestamp &&
                <p>
                    I got this data at{" "}
                    <time dateTime={remoteData.timestamp}>
                        {remoteData.timestamp}
                    </time>
                </p>
            }
          <ul>
            {remoteData.data.map((p) => (
              <li key={p.displayName}>{p.displayName}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default Page;
