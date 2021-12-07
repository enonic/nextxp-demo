import React from 'react';

import {fetchContent, PageData, ResultMeta} from "../xpAdapter/guillotine/fetchContent";

import MainXpView from "../xpAdapter/views/_MainXpView";
import {getPublicAssetUrl} from "../xpAdapter/enonic-connection-config";
import {getTypeSelection} from '../customXp/contentSelector';
import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next';
import {ParsedUrlQuery} from 'node:querystring';

export interface ServerSideParams
    extends ParsedUrlQuery {
    // String array catching a sub-path assumed to match the site-relative path of an XP content.
    contentPath?: string[];
}

export interface ServerSideProps {
    content: Record<string, any>,
    meta: ResultMeta | null,
    page: PageData | null,
    error: {
        code: string,
        message: string
    } | null,
}

export type Context = GetServerSidePropsContext<ServerSideParams>;

////////////////////////////////////////////////////////////////////////////////////////////// SSR:

export const getServerSideProps: GetServerSideProps = async (context: Context): Promise<GetServerSidePropsResult<ServerSideProps>> => {
    const {
        content,
        meta = null,
        error = null,
        page = null,
    } = await fetchContent(context.params?.contentPath || [], context);

    // return 404 if not able to render
    if (meta && !meta.hasController && !getTypeSelection(content.type)) {
        context.res.statusCode = 501;
    }

    return {
        props: {
            content: {
                ...content,

                // Injecting into props some values used in the header:
                layoutProps: {
                    title: content?.displayName || "Next.JS",
                    logoUrl: getPublicAssetUrl('images/xp-shield.svg', context),
                }

            },
            meta,
            error,
            page,
        }
    }
};

export default MainXpView;
