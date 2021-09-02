import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import { fetchData } from "../../shared/data/fetching";
import BasePage from "../../components/BasePage";

const BRANCH = 'draft';



////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below
/*


type Context = {
    // this type is purposefully naive. Please make sure to update this with a more
    // accurate model before using it.
    params: { contentPath: string[] };
};

export const getServerSideProps = async ({params}: Context) => {
    return {
        props: await fetchContentMeta(params.contentPath)
    };
};

export default BasePage;

*/



////////////////////////////////////////////////////////////////////////////////////////////// CLIENT: uncomment this instead of SSR above

const ClientSideFetch = () => {

    const [props, setProps] = useState({error: null, content: null});

    const router = useRouter();
    const contentPath = router.query.contentPath;

    useEffect(
        () => {

            const refresh = async (contentPath) => {
                const contentResult = await fetchData(BRANCH, contentPath);

                setTimeout(() => {
                        // @ts-ignore
                        setProps(() => contentResult);
                    },
                    750);
            };

            if (contentPath !== undefined) {
                refresh(contentPath);
            }
        },
        [contentPath]
    );

    return <BasePage error={props.error} content={props.content}/>;
}

export default ClientSideFetch;
