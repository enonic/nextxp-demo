import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentChildren, Timestamped} from "../../shared/data";
import getMoviesQuery, {MovieList} from "../../shared/data/queries/getMovies";
import {appNameUnderscored} from "../../../enonic.connection.config";

type Props = {
    movies: MovieList,
    timestamp: string,
    title: string
};



const Page: React.FC<Props> = ( {movies, timestamp}: Props ) => {
    return (
        <div>
            <ul>
                {movies.map((movie, i) => (
                    <li key={i}>{JSON.stringify(movie)}</li>
                ))}
            </ul>

            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>
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
            title: "Movies"
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

