import {GetServerSideProps, GetStaticProps} from "next";
import Head from "next/head";
import {fetchContentChildren, Timestamped} from "../../shared/data";
import getPersonsQuery, {PersonList} from "../../shared/data/queries/getPersons";
import { appNameUnderscored } from "../../shared/data/config";

type Props = {
    persons: PersonList;
    timestamp: string;
};

const Page: React.FC<Props> = ( {persons, timestamp}: Props ) => {
    return (
        <div>
            <Head>
                <title>Persons</title>
            </Head>

            <h1>Persons</h1>
            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>

            <ul>
                {persons.map((person, i) => (
                    <li key={person.id}>{person.displayName}</li>
                ))}
            </ul>
        </div>
    );
};

export default Page;




const personsQuery = getPersonsQuery(appNameUnderscored);
export const fetchPersons = async (): Promise<Timestamped<PersonList>> => fetchContentChildren(personsQuery);


// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchPersons().then( data => ({
        props: {
            timestamp: data.timestamp,
            persons: data.content,
        },
    }));




/*
// SSG
export const getStaticProps: GetStaticProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchPersons().then( data => ({
        props: {
            timestamp: data.timestamp,
            persons: data.contentList,
        },
    }));
*/
