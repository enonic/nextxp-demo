import {GetServerSideProps, GetStaticProps} from "next";
import Head from "next/head";
import {fetchMovies, fetchPersons} from "../../shared/data";

type Props = {
    movies: {}[];
    timestamp: string;
};



const Page: React.FC<Props> = ({ movies, timestamp }) => {
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



// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchMovies().then( data => ({
        props: {
            timestamp: data.timestamp,
            movies: data.contentList,
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

