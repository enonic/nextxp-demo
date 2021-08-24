import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentItem, Timestamped} from "../../shared/data";
import getMovieQuery, {Movie} from "../../shared/data/queries/getMovie";
import {appNameDashed, appNameUnderscored} from "../../../enonic.connection.config";
import MoviePage from "../../components/templates/movie";


type Props = {
    movie: Movie & {
        soMe?: {}
    },
    timestamp: string,
    title: string
};



const Page: React.FC<Props> = ( {movie, timestamp}: Props ) => <MoviePage movie={movie} />

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
            title: data.content.displayName
        },
    }));
}



