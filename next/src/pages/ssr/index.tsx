import { GetServerSideProps } from "next";
import Head from "next/head";
import { fetchPeople } from "../../shared/data";

type Props = {
  people: string[];
  timestamp: string;
};

const Page: React.FC<Props> = ({ people, timestamp }) => {
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
        {people.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: Props }> => {
  const people = await fetchPeople().then((people) =>
    people.map((p) => p.displayName)
  );

  return {
    props: {
      people,
      timestamp: new Date().toISOString(),
    },
  };
};

export default Page;
