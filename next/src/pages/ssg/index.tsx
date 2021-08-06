import { GetStaticProps } from "next";
import Head from "next/head";
import { fetchMovies } from "../../shared/data";

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
  const movies = await fetchMovies().then((people) =>
    people.map((p) => p.displayName)
  );

  return {
    props: {
      movies,
      timestamp: new Date().toISOString(),
    },
  };
};

export default Page;
