import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentItem, Timestamped} from "../../shared/data";
import getMovieQuery, {Movie} from "../../shared/data/queries/getMovie";
import {appNameDashed, appNameUnderscored} from "../../../enonic.connection.config";


type Props = {
    movie: Movie & {
        soMe?: {}
    };
    timestamp: string;
};



const Page: React.FC<Props> = ( {movie, timestamp}: Props ) => {
    return (
        <div>
            <h2>{movie.displayName}</h2>
            <p>{JSON.stringify(movie)}</p>

            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>
        </div>
    );
};

export default Page;



export const fetchMovie = async (personSubPath): Promise<Timestamped<Movie>> => {
    const movieQuery = getMovieQuery(appNameUnderscored, personSubPath);
    return fetchContentItem(movieQuery);
}

// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> => {
    const { movieSubPath } = context.query;
    return await fetchMovie(movieSubPath).then( data => ({
        props: {
            timestamp: data.timestamp,
            movie: data.content,
        },
    }));
}



