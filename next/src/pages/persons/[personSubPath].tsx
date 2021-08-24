import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentItem, Timestamped} from "../../shared/data";
import getPersonQuery, {Person} from "../../shared/data/queries/getPerson";
import {appNameUnderscored, appNameDashed} from "../../../enonic.connection.config";
import PersonPage from "../../components/templates/person";

type Props = {
    person: Person & {
        soMe?: {}
    },
    timestamp: string,
    title: string
};



const Page: React.FC<Props> = ( {person, timestamp}: Props ) => <PersonPage person={person} />

export default Page;



export const fetchPerson = async (personSubPath): Promise<Timestamped<Person>> => {
    const personQuery = getPersonQuery(appNameUnderscored, personSubPath);
    return fetchContentItem(personQuery);
}

// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> => {
    const { personSubPath } = context.query;
    return await fetchPerson(personSubPath).then( data => ({
        props: {
            timestamp: data.timestamp,
            person: data.content,
            title: data.content.displayName
        },
    }));
}



