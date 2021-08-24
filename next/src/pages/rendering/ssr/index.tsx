import { GetServerSideProps } from "next";
import Head from "next/head";
import {fetchContentChildren, Timestamped} from "../../../shared/data";
import getPersonsQuery, {PersonList} from "../../../shared/data/queries/getPersons";
import {appNameUnderscored} from "../../../../enonic.connection.config";

type Props = {
  persons: string[];
  timestamp: string;
};

const Page: React.FC<Props> = ( {persons, timestamp}: Props) => {
  return (
    <div>
      <Head>
        <title>SSR: Next.js data poc</title>
      </Head>
      <h1>SSR</h1>
      <p>This page contains server-side rendered data.</p>
      <p>
        Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
      </p>
      <ul>
        {persons.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};



const personsQuery = getPersonsQuery(appNameUnderscored);
export const fetchPersons = async (): Promise<Timestamped<PersonList>> => fetchContentChildren(personsQuery);


export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> =>
  await fetchPersons().then( data => ({
    props: {
      timestamp: data.timestamp,
      persons: data.content.map((p) => p.displayName),
    },
  }));

export default Page;
