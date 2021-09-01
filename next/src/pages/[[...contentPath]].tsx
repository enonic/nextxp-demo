import {fetchContent} from "../shared/data";
import {contentApiUrlGetters} from "../../enonic.connection.config";
import Custom500 from './500';
import Custom404 from './404';
import React, { useState, useEffect } from 'react';

const {
    full: getContentFullUrl,
    base: getContentBaseUrl
} = contentApiUrlGetters.master;

// this type is purposefully naive. Please make sure to update this with a more
// accurate model before using it.
type Context = {
    params: { contentPath: string[] };
};


// Shape of content base-data API body
type ContentApiBaseBody = {
    idOrPath: string,           // Full content item _path
    maxChildren?: number,       // On the default query, can set between 0 and 1000 to limit or disable the children below folder content items
    query?: string,             // Override the default base-data query
    variables?: string,         // GraphQL variables inserted into the query

    // Not needed when the API is a mapped controller below a site, as is default here. But needed if using the service API:
    branch?: string,            // master or draft.
    siteId?: string             // UUID for the site to fetch content below.
};


const Page = ({error, contentBase, freshen}) => {
    /*if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
    }*/

    // TODO: general fallback page. Resolve specific pages above
    return <div onClick={freshen}>
        <p>ContentBase: {JSON.stringify(contentBase)}</p>
        <p>Error: {JSON.stringify(error)}</p>
    </div>;
};

const Main = () => {
    const [props, setProps] = useState({error: {}, contentBase: {}});

    const freshen = async () => {
        const p = await fetchContentBase(['hmdb', 'persons', 'keanu-reeves']);

        console.log("p:", p);

        // @ts-ignore
        setProps(() => p);
    };

    return <Page error={props.error} contentBase={props.contentBase} freshen={freshen} />;
}

// this function also needs some serious refactoring, but for a quick and dirty
// proof of concept it does the job.
/*

export const getServerSideProps = async ({params}: Context) => ({
        props: await fetchContentBase(params.contentPath)
});
*/

export const fetchContentBase = async (contentPath: string[]) => {
    const idOrPath = "/" + contentPath.join("/");
    const appName = contentPath[0];
    //const contentFullUrl = getContentFullUrl(appName);
    const contentBaseUrl = getContentBaseUrl(appName);

    const body: ContentApiBaseBody = {idOrPath};

    const result = await fetchContent(
        contentBaseUrl,
        body
    )
        .then(json => {
            if (!json?.data?.guillotine?.get) {
                console.error('Data fetched from contentBase API:', json);
                return { error: { code: 404 }};
            }
        })
        .then(validJson => ({
            // @ts-ignore
            contentBase: validJson.data.guillotine.get
        }))
        .catch((err) => {
            return {
                error: {
                    code: 500,
                    message: err.message
                }
            };
        });

    return result;
};

export default Main;

