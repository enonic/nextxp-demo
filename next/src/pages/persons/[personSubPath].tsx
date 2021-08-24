import {GetServerSideProps, GetStaticProps} from "next";
import Head from "next/head";
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
            <Head>
                <title>Person</title>
            </Head>

            <h1>Person</h1>
            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>

            <h2>{person.displayName}</h2>
            <p>{JSON.stringify(person)}</p>
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



