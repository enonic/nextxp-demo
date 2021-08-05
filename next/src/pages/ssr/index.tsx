import { GetServerSideProps } from "next";
import Head from "next/head";

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

  const url = "http://localhost:8080/site/hmdb/draft/hmdb/api";

  const data = await fetch(url, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  }).then((res: any) => res.json());

  return {
    props: {
      people: data.data.guillotine.getChildren.map((p) => p.displayName),
      timestamp: new Date().toISOString(),
    },
  };
};

export default Page;
