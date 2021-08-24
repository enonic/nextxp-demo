import {GetStaticProps} from "next";
import {MovieList} from "../../../shared/data/queries/getMovies";
import {fetchStampedMovies} from "../client";

type Props = {
    movies: MovieList,
    timestamp: string,
    title: string
};

const Page: React.FC<Props> = ({movies, timestamp, title}) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>
                This page should contain statically rendered data. However, when running
                in dev mode, Next.js will fetch the data on every request.{" "}
            </p>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>{movie.displayName}</li>
                ))}
            </ul>
            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchStampedMovies().then(data => ({
        props: {
            timestamp: data.timestamp,
            movies: data.data,
            title: "SSG: Next.js data poc"
        },
    }));

export default Page;
