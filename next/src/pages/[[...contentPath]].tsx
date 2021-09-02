import {fetchContent} from "../shared/data";
import {contentApiUrlGetters} from "../enonic.connection.config";
import Custom500 from '../components/errors/500';
import Custom404 from '../components/errors/404';
import CustomError from '../components/errors/error';
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


const Page = ({error, contentBase, refresh}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message} />;
    }

    // TODO: general fallback page. Resolve specific pages above
    return <div onClick={refresh}>
        <p>ContentBase: {JSON.stringify(contentBase)}</p>
    </div>;
};

const Main = () => {
    const [props, setProps] = useState({error: null, contentBase: null});

    const refresh = async () => {
        console.log("Refresh!");
        const newProps = await fetchContentBase(['hmdb', 'persons', 'keanu-reeves']);
        console.log("fetched new props:", newProps);

        // @ts-ignore
        setProps(() => newProps);
    }

    return <Page error={props.error} contentBase={props.contentBase} refresh={refresh} />;
}

// this function also needs some serious refactoring, but for a quick and dirty
// proof of concept it does the job.
/*

export const getServerSideProps = async ({params}: Context) => ({
        props: await fetchContentBase(params.contentPath)
});
*/

export const fetchContentBase = async (contentPath) => {
    console.log("contentPath: ", contentPath);

    const idOrPath = "/" + contentPath.join("/");

    console.log("idOrPath (" +
    	(Array.isArray(idOrPath) ?
    		("array[" + idOrPath.length + "]") :
    		(typeof idOrPath + (idOrPath && typeof idOrPath === 'object' ? (" with keys: " + JSON.stringify(Object.keys(idOrPath))) : ""))
    	) + "): " + JSON.stringify(idOrPath, null, 2)
    );

    const appName = contentPath[0];

    //const contentFullUrl = getContentFullUrl(appName);
    const contentBaseUrl = getContentBaseUrl(appName);

    console.log("contentBaseUrl (" +
    	(Array.isArray(contentBaseUrl) ?
    		("array[" + contentBaseUrl.length + "]") :
    		(typeof contentBaseUrl + (contentBaseUrl && typeof contentBaseUrl === 'object' ? (" with keys: " + JSON.stringify(Object.keys(contentBaseUrl))) : ""))
    	) + "): " + JSON.stringify(contentBaseUrl, null, 2)
    );

    const body: ContentApiBaseBody = {idOrPath};

    const result = await fetchContent(
        contentBaseUrl,
        body
    )
        .then(json => {
            if (!json?.data?.guillotine?.get) {
                //console.error('Data fetched from contentBase API:', json);
                return { error: { code: 404 }};
            }
        })
        .then(validJson => ({
            // @ts-ignore
            contentBase: validJson.data.guillotine.get
        }))
        .catch((err) => {
            return { error:  JSON.parse(err.message) };
        });

    return result;
};

export default Main;

