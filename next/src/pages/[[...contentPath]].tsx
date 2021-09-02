import {fetchContent} from "../shared/data";
import {contentApiUrlGetters} from "../enonic.connection.config";
import Custom500 from '../components/errors/500';
import Custom404 from '../components/errors/404';
import CustomError from '../components/errors/error';
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

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


const BasePage = ({error, contentBase}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message}/>;
    }

    if (!contentBase) {
        return <p>Fetching data...</p>
    }

    // TODO: general fallback page. Resolve specific pages above
    return <div>
        <p>ContentBase: {JSON.stringify(contentBase)}</p>
    </div>;
};

const ClientSideFetch = () => {

    const [props, setProps] = useState({error: null, contentBase: null});

    const router = useRouter();
    const contentPath = router.query.contentPath;

    useEffect(
        () => {

            const refresh = async () => {
                const newProps = await fetchContentBase(contentPath);

                setTimeout(() => {
                        // @ts-ignore
                        setProps(() => newProps);
                    },
                    750);
            };

            if (contentPath !== undefined) {
                refresh();
            }
        },
        [contentPath]
    );

    return <BasePage error={props.error} contentBase={props.contentBase}/>;
}

export default ClientSideFetch;





// this function also needs some serious refactoring, but for a quick and dirty
// proof of concept it does the job.
/*

export const getServerSideProps = async ({params}: Context) => ({
        props: await fetchContentBase(params.contentPath)
});
*/

export const fetchContentBase = async (contentPath) => {
    const idOrPath = "/" + contentPath.join("/");
    const appName = contentPath[0];

    //const contentFullUrl = getContentFullUrl(appName);
    const contentBaseUrl = getContentBaseUrl(appName);

    const body: ContentApiBaseBody = {idOrPath};

    return await fetchContent(contentBaseUrl, body);
};

