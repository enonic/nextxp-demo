import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

import Custom500 from '../../components/errors/500';
import Custom404 from '../../components/errors/404';
import CustomError from '../../components/errors/error';
import { fetchData } from "../../shared/data";

const BRANCH = 'draft';

// this type is purposefully naive. Please make sure to update this with a more
// accurate model before using it.
type Context = {
    params: { contentPath: string[] };
};




const BasePage = ({error, content}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message}/>;
    }

    if (!content) {
        return <p>Fetching data...</p>
    }

    // TODO: general fallback page. Resolve specific pages above
    return <div>
        <p>content: {JSON.stringify(content)}</p>
    </div>;
};




////////////////////////////////////////////////////////////////////////////////////////////// SSR: uncomment this instead of CLIENT below
/*

export default BasePage;

export const getServerSideProps = async ({params}: Context) => {
    return {
        props: await fetchContentMeta(params.contentPath)
    };
};
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
