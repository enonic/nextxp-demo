import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentGet} from "../../shared/data";
import getMovieQuery, {Movie} from "../../shared/data/queries/getMovie";
import {appKeyUnderscored} from "../../../enonic.connection.config";
import MoviePage from "../../components/templates/movie";


type Props = {
    movie: Movie & {
        soMe?: {}
    },
    title: string
};



const Page: React.FC<Props> = ( {movie}: Props ) => <MoviePage movie={movie} />

export default Page;



export const fetchMovie = async (personSubPath): Promise<Movie> => {
    const movieQuery = getMovieQuery(appKeyUnderscored, personSubPath);
    return fetchContentGet(movieQuery);
}

// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> => {
    const { movieSubPath } = context.query;
    return await fetchMovie(movieSubPath).then( content => ({
        props: {
            movie: content,
            title: content.displayName
        },
    }));
}


/*
// SSG
export const getStaticProps: GetStaticProps = async (
    context
): Promise<{ props: Props }> =>

    ...etc...

    }));
*/


