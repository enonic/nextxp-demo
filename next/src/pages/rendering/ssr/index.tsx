import {GetServerSideProps} from "next";
import {PersonList} from "../../../shared/data/queries/getPersons";
import {fetchStampedPersons} from "../client";

type Props = {
    persons: PersonList,
    timestamp: string,
    title: string
};

const Page: React.FC<Props> = ({persons, timestamp, title}: Props) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>This page contains server-side rendered data.</p>
            <ul>
                {persons.map((person) => (
                    <li key={person.id}>{person.displayName}</li>
                ))}
            </ul>
            <p>
                Data timestamp: <time dateTime={timestamp}>{timestamp}</time>.
            </p>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (
    context
): Promise<{ props: Props }> =>
    await fetchStampedPersons().then(data => ({
        props: {
            timestamp: data.timestamp,
            persons: data.data,
            title: "SSR: Next.js data poc"
        },
    }));

export default Page;
