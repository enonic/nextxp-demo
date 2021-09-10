import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {Branch, ContentResult} from "../shared/data/fetchContent";
import BasePage, {BasePageProps} from "./BasePage";

type Props = {
    branch: Branch,
    fetchContent: (contentPath: string|string[], branch: Branch) => Promise<ContentResult<any>>
};

const ClientSideBasePage = ({branch, fetchContent}: Props) => {

    const [props, setProps] = useState({error: null, content: {}, fetching: true});

    const router = useRouter();
    const contentPath = router.query.contentPath;

    useEffect(
        () => {

            const refresh = async (contentPath) => {
                setProps(props => ({...props, fetching: true}));

                const contentResult: BasePageProps = await fetchContent(contentPath, branch);

                //console.log("Fetched content result:", contentResult);

                // @ts-ignore
                setProps(() => contentResult);

                // Simulate server delay - instead of the setProps line above:
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

    if (props.fetching) {
        return <p className="spinner">Fetching data...</p>
    }
    return <BasePage {...props} />;
};
export default ClientSideBasePage;
