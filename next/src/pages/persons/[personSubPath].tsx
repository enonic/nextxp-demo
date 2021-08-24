import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentItem} from "../../shared/data";
import getPersonQuery, {Person} from "../../shared/data/queries/getPerson";
import {appNameUnderscored} from "../../../enonic.connection.config";
import PersonPage from "../../components/templates/person";

type Props = {
    person: Person & {
        soMe?: {}
    },
    title: string
};



const Page: React.FC<Props> = ( {person}: Props ) => <PersonPage person={person} />

export default Page;



export const fetchPerson = async (personSubPath): Promise<Person> => {
    const personQuery = getPersonQuery(appNameUnderscored, personSubPath);
    return fetchContentItem(personQuery);
}

// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> => {
    const { personSubPath } = context.query;
    return await fetchPerson(personSubPath).then( content => ({
        props: {
            person: content,
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
