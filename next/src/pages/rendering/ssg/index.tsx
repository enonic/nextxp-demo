import {GetStaticProps} from "next";
import {fetchMovies} from "../../movies";
import {MovieList} from "../../../shared/data/queries/getMovies";

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
    await fetchMovies().then(data => ({
        props: {
            timestamp: data.timestamp,
            movies: data.content,
            title: "SSG: Next.js data poc"
        },
    }));

export default Page;
