import { GetStaticProps } from "next";
import Head from "next/head";

type Props = {
  movies: string[];
  timestamp: string;
};

const Page: React.FC<Props> = ({ movies, timestamp }) => {
  return (
    <div>
      <Head>
        <title>SSG: Next.js data poc</title>
      </Head>
      <h1>SSG</h1>
      <p>
        This page should contain statically rendered data. However, when running
        in dev mode, Next.js will fetch the data on every request.{" "}
      </p>
      <p>
        Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
      </p>
      <ul>
        {movies.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (
  context
): Promise<{ props: Props }> => {
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

  const url = "http://localhost:8080/site/hmdb/draft/hmdb/api";

  const data = await fetch(url, {
    method: "post",
    body: JSON.stringify({ query, variables: null }),
  }).then((res: any) => res.json());

  return {
    props: {
      movies: data.data.guillotine.getChildren.map((p) => p.displayName),
      timestamp: new Date().toISOString(),
    },
  };
};

export default Page;
