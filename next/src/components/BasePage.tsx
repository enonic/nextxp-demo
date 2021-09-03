import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {fetchContent} from "../shared/data/fetchContent";

import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/error';

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

export default BasePage;





////////////////////////////////////////////////////////////////////////

export const clientSideBasePageBuilder = branch => {
    const ClientSideFetchingBasePage = () => {

        const [props, setProps] = useState({error: null, content: null});

        const router = useRouter();
        const contentPath = router.query.contentPath;

        useEffect(
            () => {

                const refresh = async (contentPath) => {
                    const contentResult = await fetchContent(branch, contentPath);

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
    };
    return ClientSideFetchingBasePage;
};
