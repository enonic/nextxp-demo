// KEEP OK


import React from 'react';

import { getUrlFromLookupTable } from '@navikt/nav-dekoratoren-moduler';

import { useRouter } from 'next/router';

import {
    ContentProps,
    ContentType,
} from '../types/content-props/_content-common';
import { XpResponseProps} from '../utils/fetch-content';
import { isMediaContent } from '../types/media';

import PageWrapper from './PageWrapper';
import ContentMapper, {isContentTypeImplemented} from './ContentMapper';

// import {error1337ReloadProps} from "./pages/error-page/errorcode-content/Error1337ReloadOnDevBuildError";


// src/utils/fetch-content.ts
/*
import {
    adminOrigin, appOrigin, xpOrigin, xpServicePath, xpServiceUrl,
    getMediaUrl,
    getRelativePathIfInternal,
    isAppUrl, isXpUrl,
    routerQueryToXpPathOrId,
    sanitizeLegacyUrl,

} from '../utils/urls';
*/


type ErrorData = {
    errorMessage?: string;
    errorCode?: number;
    feedback?: boolean;
};

interface ErrorProps extends ContentProps {
    __typename: ContentType.Error;
    data: ErrorData;
}

type PageProps = {
    content: ContentProps;
};

type StaticProps = {
    props: PageProps | {};
    redirect?: { destination: string; permanent: boolean };
    notFound?: boolean;
};


///////////////////////////////////////////////////////////////////////////  Constants

const xpOrigin = process.env.XP_ORIGIN;
const appOrigin = process.env.APP_ORIGIN;
const adminOrigin = process.env.ADMIN_ORIGIN;

const xpServicePath = '/_/service/no.nav.navno';
const xpDraftPathPrefix = '/admin/site/preview/default/draft/www.nav.no';
const xpContentPathPrefix = '/www.nav.no';
const xpProdAppOrigin = 'https://www.nav.no';

const xpServiceUrl = `${xpOrigin}${xpServicePath}`;

// import globalState from '../globalState';
const globalState = {
    isDraft: false,
};

const { ENV } = process.env;

const internalPaths = [
    '$',
    'no',
    'en',
    'se',
    'nav.no',
    'skjemaer',
    'forsiden',
    'footer-contactus-no',
    'footer-contactus-en',
    'sykepenger-korona',
    'beskjed',
    'person\\/kontakt-oss(?!(\\/(nb|en))?\\/(tilbakemeldinger|finnkontor|samegiella|chat))',
];

/////////////////////////////////////////////////////////////////////////// errors & import { errorHandler, isNotFound } from '../utils/errors';


const isNotFound = (content: ContentProps) => {
    return (
        (content.__typename === ContentType.Error &&
            content.data.errorCode === 404) ||
        !isContentTypeImplemented(content)
    );
};

// These status codes may indicate that the requested page has been intentionally
// made unavailable.  We want to perform cache revalidation in these cases.
const revalidateOnErrorCode = {
    401: true, // unauthorized
    403: true, // forbidden
    404: true, // not found
};

const appError = (content: ContentProps) => ({
    content,
});

const errorHandlerProd = (content: ContentProps) => {
    if (!revalidateOnErrorCode[content.data.errorCode]) {
        throw appError(content);
    }

    return { props: { content } };
};

const errorHandlerDev = (content: ContentProps) => {
    if (!revalidateOnErrorCode[content.data.errorCode]) {
        // Do not throw errors at build-time in dev-environments
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return {
                props: {
                    content: error1337ReloadProps(content._path),
                },
            };
        }

        throw appError(content);
    }

    return { props: { content } };
};

const errorHandler =
    process.env.APP_ORIGIN === xpProdAppOrigin
        ? errorHandlerProd
        : errorHandlerDev;



const error1337ReloadProps = (path: string) =>
    makeErrorProps(
        path,
        'Dette er en testmiljø-spesifikk bygg-feil - forsøk å refreshe siden 1-4 ganger',
        1337
    );



const makeErrorProps = (
    idOrPath = '/',
    errorMessage = 'Ukjent feil',
    errorCode = 500
): ErrorProps => ({
    __typename: ContentType.Error,
    _path: idOrPath,
    _id: idOrPath,
    displayName: errorMessage,
    createdTime: Date.now().toString(),
    modifiedTime: Date.now().toString(),
    data: {
        feedback: false,
        errorMessage: errorMessage,
        errorCode: errorCode,
    },
    // breadcrumbs: [{ title: errorMessage, url: '/' }],
});

const ErrorPage = (props) => {
    const { errorMessage, errorCode } = props.data;

    console.error(`Error code ${errorCode} - ${errorMessage}`);

    return (
        <div className={`error error${errorCode}`}>
            <h1>{errorCode}</h1>
            <p>{errorMessage}</p>
        </div>
    );
};



///////////////////////////////////////////////////////////////////////////  from '../utils/urls':

const internalUrlPrefix = `^(${appOrigin}|${adminOrigin})?(${xpContentPathPrefix})?`;

const internalUrlPrefixPattern = new RegExp(internalUrlPrefix, 'i');


const sanitizeLegacyUrl = (url: string) =>
    url
        .toLowerCase()
        .replace(/\+|\s|( - )/g, '-')
        .replace(/,/g, '')
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'o')
        .replace(/å/g, 'a');

// Matches both relative and absolute urls which points to content internal to the app
const appUrlPattern = new RegExp(
    `${internalUrlPrefix}($|\\/(${internalPaths.join('|')}))`,
    'i'
);
const isAppUrl = (url: string) => url && appUrlPattern.test(url);

// Matches urls pointing directly to XP (/_/*)
const xpUrlPattern = new RegExp(`${internalUrlPrefix}/_`, 'i');
const isXpUrl = (url: string) => url && xpUrlPattern.test(url);


const getInternalRelativePath = (
    url: string,
    isDraft = globalState.isDraft
) => {
    const relativePath = url.replace(internalUrlPrefixPattern, '');

    if (isDraft) {
        return `${xpDraftPathPrefix}${relativePath}`;
    }

    return relativePath;
};

const isInternalUrl = (url: string) =>
    url && (isAppUrl(url) || isXpUrl(url));

const getRelativePathIfInternal = (
    url: string,
    isDraft = globalState.isDraft
) => {
    if (!isInternalUrl(url)) {
        return url;
    }

    return getInternalRelativePath(url, isDraft);
};

const getInternalAbsoluteUrl = (
    url: string,
    isDraft = globalState.isDraft
) => {
    if (!isInternalUrl(url)) {
        console.log(`Warning: ${url} is not an internal url`);
        return url;
    }

    const internalPath = getInternalRelativePath(url, isDraft);

    return `${isDraft ? adminOrigin : appOrigin}${internalPath}`;
};



// Media url must always be absolute, to prevent internal nextjs routing loopbacks on redirects|
const getMediaUrl = (url: string, isDraft = globalState.isDraft) => {
    return url?.replace(
        internalUrlPrefixPattern,
        isDraft ? `${adminOrigin}${xpDraftPathPrefix}` : appOrigin
    );
};

const fetchWithTimeout = (
    url: string,
    timeout: number,
    config?: any
): Promise<any> =>
    Promise.race([
        fetch(url, config),
        new Promise((res) =>
            setTimeout(
                () =>
                    res({
                        ok: false,
                        status: 408,
                        statusText: 'Request Timeout',
                    }),
                timeout
            )
        ),
    ]);

const objectToQueryString = (params: object) =>
    params
        ? Object.entries(params).reduce(
            (acc, [k, v], i) =>
                v !== undefined
                    ? `${acc}${i ? '&' : '?'}${k}=${encodeURIComponent(
                        typeof v === 'object' ? JSON.stringify(v) : v
                    )}`
                    : acc,
            ''
        )
        : '';

const getEnvUrl = (path: string) =>
    ENV && ENV !== 'localhost' && ENV !== 'prod'
        ? getUrlFromLookupTable(path, ENV as 'dev' | 'q0' | 'q1' | 'q2' | 'q6')
        : path;

const stripXpPathPrefix = (path: string) =>
    path?.startsWith(xpContentPathPrefix)
        ? path.slice(xpContentPathPrefix.length)
        : path;

/*
const getTargetIfRedirect = (contentData: ContentProps) => {
    switch (contentData?.__typename) {
        case ContentType.Site:
            return '/no/person';
        case ContentType.InternalLink:
            return getEnvUrl(
                stripXpPathPrefix(contentData.data?.target?._path)
            );
        case ContentType.ExternalLink:
        case ContentType.Url:
            return getEnvUrl(stripXpPathPrefix(contentData.data?.url));
        default:
            return null;
    }
};
*/



const fetchSiteContent = (
    idOrPath: string,
    isDraft = false,
    secret: string
): Promise<XpResponseProps> => {
    const params = objectToQueryString({
        ...(isDraft && { branch: 'draft' }),
        id: idOrPath,
    });
    const url = `${xpServiceUrl}/sitecontent${params}`;
    const config = { headers: { secret } };
    console.log('Fetching content from ', url);

    return fetchWithTimeout(url, 15000, config)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            const error = `Failed to fetch content from ${idOrPath}: ${res.statusText}`;
            return makeErrorProps(idOrPath, error, res.status);
        })
        .catch(console.error);
};

const fetchPage = async (
    idOrPath: string,
    isDraft = false,
    secret: string
): Promise<XpResponseProps> => {
    const content = await fetchSiteContent(idOrPath, isDraft, secret);

    return content?.__typename
        ? { ...content, editMode: isDraft }
        : makeErrorProps(idOrPath, `Ukjent feil`, 500);
};



const FallbackPage = () => {
    return (
        <div className="fallback-page">Loading page content...</div>
    );
};

export const PageBase = (props: PageProps) => {
    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPage />;
    }

    if (!props?.content) {
        return (
            <ErrorPage
                {...makeErrorProps(
                    'www.nav.no',
                    'Ukjent feil - kunne ikke laste innhold'
                )}
            />
        );
    }

    const { content } = props;

    // globalState.isDraft = !!content.editMode;

    return JSON.stringify(props);
        /*(
        <PageWrapper content={content}>
            <ContentMapper content={content} />
        </PageWrapper>
        );*/
};
/*

const redirectProps = (destination: string, isPermanent = false) => ({
    props: {},
    redirect: {
        // Decode then (re)encode to ensure the destination is not double-encoded
        destination: encodeURI(decodeURI(destination).trim()),
        permanent: isPermanent,
    },
});
*/


///////////////////////////////////////////////////////////////


export const fetchPageProps = async (
    routerQuery: string | string[],
    isDraft = false,
    secret: string
): Promise<StaticProps> => {
    const xpPath = routerQueryToXpPathOrId(routerQuery || '');
    const content = await fetchPage(xpPath, isDraft, secret);

    // Media content should redirect to the mediaUrl generated by XP
    if (isMediaContent(content)) {
        return redirectProps(getMediaUrl(content.mediaUrl, isDraft));
    }

    if (isNotFound(content)) {
        const sanitizedPath = sanitizeLegacyUrl(xpPath);

        if (sanitizedPath !== xpPath) {
            return redirectProps(stripXpPathPrefix(sanitizedPath));
        }

        return {
            props: {},
            notFound: true,
        };
    }

    if (content.__typename === ContentType.Error) {
        return errorHandler(content);
    }

    /*
    const redirectTarget = getTargetIfRedirect(content);
    if (redirectTarget) {
        return redirectProps(
            getRelativePathIfInternal(redirectTarget, isDraft)
        );
    }
     */

    return {
        props: { content },
    };
};

export default PageBase;
