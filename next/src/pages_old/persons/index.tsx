import {GetServerSideProps, GetStaticProps} from "next";
import {fetchContentChildren} from "../../shared/data";
import getPersonsQuery, {PersonList} from "../../shared/data/queries/getPersons";
import {appKeyUnderscored} from "../../enonic.connection.config";

import ListPage from '../../components/templates/list';

type Props = {
    persons: PersonList,
    title: string
};

const Page: React.FC<Props> = ( {title, persons}: Props ) => <ListPage title={title} itemPageRoot="/persons" nodes={persons} />;

export default Page;




const personsQuery = getPersonsQuery(appKeyUnderscored);
export const fetchPersons = async (): Promise<PersonList> => fetchContentChildren(personsQuery);


// SSR
export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchPersons().then( contentList => ({
        props: {
            persons: contentList,
            title: "Persons"
        },
    }));





/*
// SSG
export const getStaticProps: GetStaticProps = async (
    context
): Promise<{ props: Props }> =>

    ...etc...

    }));
*/
