import Head from "next/head";
import { useState } from "react";
import * as React from "react";

import {PersonList} from "../../../shared/data/queries/getPersons";
import {MovieList} from "../../../shared/data/queries/getMovies";
import {fetchPersons} from "../../persons";
import {fetchMovies} from "../../movies";
import {Timestamped} from "../../../shared/data";



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
      <DataDisplay fetchData={fetchPersons} sectionName={"People"} />
      <DataDisplay fetchData={fetchMovies} sectionName={"Movies"} />
    </div>
  );
};

type DataList = PersonList | MovieList;

type DataDisplayProps = {
  fetchData: () => Promise<Timestamped<DataList>>;
  sectionName: string;
};

type RemoteData =
  | { status: "NotAsked"; data: undefined }
  | { status: "Loading"; data?: DataList }
  | { status: "Success"; data: DataList, timestamp: string }
  | { status: "Error"; message: string; data?: DataList };

const DataDisplay: React.FC<DataDisplayProps> = ({
  fetchData,
  sectionName,
}) => {
  const [remoteData, setRemoteData] = useState<RemoteData>({
    status: "NotAsked",
    data: undefined,
  });

  const getData = () => {
    setRemoteData({ status: "Loading", data: remoteData.data });
    fetchData()
      .then((data) => {
        setRemoteData({ status: "Success", data: data.content, timestamp: data.timestamp });
      })
      .catch((err) => {
        setRemoteData({
          status: "Error",
          message: err.message,
          data: remoteData.data,
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
          <p>
            I got this data at{" "}
            <time dateTime={remoteData.timestamp}>
              {remoteData.timestamp}
            </time>
          </p>
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
