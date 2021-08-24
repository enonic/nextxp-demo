import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentChildren, Timestamped} from "../../shared/data";
import getPersonsQuery, {PersonList} from "../../shared/data/queries/getPersons";
import { appNameUnderscored } from "../../../enonic.connection.config";

import ListPage from '../../components/templates/list';

type Props = {
    persons: PersonList,
    timestamp: string,
    title: string
};

const Page: React.FC<Props> = ( {title, persons, timestamp}: Props ) => <ListPage title={title} itemPageRoot="/persons" nodes={persons} />;

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
            title: "Persons"
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
