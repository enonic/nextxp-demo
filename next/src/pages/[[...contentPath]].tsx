import {fetchContent} from "../shared/data";
import {contentApiUrlGetters} from "../../enonic.connection.config";
import Custom500 from './500';
import Custom404 from './404';

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


const Page = ({error, contentBase}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404 />
            case 500:
                return <Custom500 message={error.message} />;
        }
    }

    // TODO: general fallback page. Resolve specific pages above
    return <p>{JSON.stringify(contentBase)}</p>;
};


// this function also needs some serious refactoring, but for a quick and dirty
// proof of concept it does the job.
export const getServerSideProps = async ({params}: Context) => {
    const idOrPath = "/" + params.contentPath.join("/");

    const appName = params.contentPath[0];
    const contentFullUrl = getContentFullUrl(appName);
    const contentBaseUrl = getContentBaseUrl(appName);

    const body: ContentApiBaseBody = {idOrPath};

    const contentBase = await fetchContent(
        contentBaseUrl,
        body
    )
        .then(json => {
            if (!(json?.data?.guillotine || {}).get) {
                console.error('Data fetched from contentBase API:', json);
                return { props: { error: { code: 404} } };
            }
        })
        .catch((err) => {
            return {
                props: {
                    error: {
                        code: 500,
                        message: err.message
                    }
                }
            };
        });


    return {
        props: {
            contentBase,
        },
    };
};

export default Page;
