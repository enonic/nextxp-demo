import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentItem, Timestamped} from "../../shared/data";
import getPersonQuery, {Person} from "../../shared/data/queries/getPerson";
import {appNameUnderscored, appNameDashed} from "../../shared/data/config";

type Props = {
    person: Person & {
        soMe?: {}
    };
    timestamp: string;
};



const Page: React.FC<Props> = ( {person, timestamp}: Props ) => {
    return (
        <div>
            <h2>{person.displayName}</h2>
            <p>{JSON.stringify(person)}</p>

            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>
        </div>
    );
};

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
            person: data.content
        },
    }));
}



