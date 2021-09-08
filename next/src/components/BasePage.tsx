import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {fetchContent} from "../shared/data/fetchContent";
import {getTemplate} from "./templateSelector";

import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/error';
import {g} from "../enonic-connection-config";

const BasePage = ({error, content, fetching}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message}/>;
    }

    if (fetching) {
        return <p className="spinner">Fetching data...</p>
    }

    if (content) {
        const TemplatePage = getTemplate(content.type);
        return <TemplatePage {...content} />
    }

    return null;
};

export default BasePage;




////////////////////////////////////////////////////////////////////////

export const buildClientSideBasePage = (branch: string) => {
    const ClientSideFetchingBasePage = () => {

        const [props, setProps] = useState({error: null, content: null, fetching: false});

        const router = useRouter();
        const contentPath = router.query.contentPath;

        useEffect(
            () => {

                const refresh = async (contentPath: string|string[]) => {
                    setProps(props => ({...props, fetching: true}));

                    const contentResult = await fetchContent(contentPath, branch);

                    // @ts-ignore
                    setProps(() => contentResult);

                    // Simulate server delay: comment out the setProps line above, and activate this:
                    /*setTimeout(() => {
                            // @ts-ignore
                            setProps(() => contentResult);
                        },
                        750);*/
                };

                if (contentPath !== undefined) {
                    refresh(contentPath);
                }
            },
            [contentPath]
        );

        return <BasePage error={props.error} content={props.content} fetching={props.fetching}/>;
    };
    return ClientSideFetchingBasePage;
};
