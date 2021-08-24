import {GetServerSideProps, GetStaticProps} from "next";
import Head from "next/head";
import {fetchContentChildren, Timestamped} from "../../shared/data";
import getMoviesQuery, {MovieList} from "../../shared/data/queries/getMovies";
import {appNameUnderscored} from "../../shared/data/config";

type Props = {
    movies: MovieList;
    timestamp: string;
};



const Page: React.FC<Props> = ( {movies, timestamp}: Props ) => {
    return (
        <div>
            <Head>
                <title>Movies</title>
            </Head>

            <h1>Movies</h1>
            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>

            <ul>
                {movies.map((movie, i) => (
                    <li key={i}>{JSON.stringify(movie)}</li>
                ))}
            </ul>
        </div>
    );
};

export default Page;



const moviesQuery = getMoviesQuery(appNameUnderscored);
export const fetchMovies = async (): Promise<Timestamped<MovieList>> => fetchContentChildren(moviesQuery);


// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchMovies().then( data => ({
        props: {
            timestamp: data.timestamp,
            movies: data.content,
        },
    }));



/*
// SSG
export const getStaticProps: GetStaticProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchMovies().then( data => ({
        props: {
            timestamp: data.timestamp,
            movies: data.contentList,
        },
    }));
*/

