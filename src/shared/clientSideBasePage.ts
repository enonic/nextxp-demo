import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Branch} from "./data/fetchContent";
import BasePage, {BasePageProps} from "../components/BasePage";

export const buildClientSideBasePage = (branch: Branch, fetchContent) => {
    const ClientSideFetchingBasePage = () => {

        const [props, setProps] = useState({error: null, content: null, fetching: false});

        const router = useRouter();
        const contentPath = router.query.contentPath;

        useEffect(
            () => {

                const refresh = async (contentPath) => {
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

        // @ts-ignore
        return <BasePage error={props.error} content = {props.data} fetching = {props.fetching} />;
    };
    return ClientSideFetchingBasePage;
};
