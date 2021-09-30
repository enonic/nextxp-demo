import React from 'react';

import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/Error';

import DefaultPage from "../components/pagetypes/_Default";
import { pageSelector } from "../selectors/pages";

import {ResultMeta} from "../shared/data/fetchContent";


export type BasePageProps = {
    error?: {
        code: string,
        message: string
    },
    meta?: ResultMeta,
    data?: any
    fetching?: boolean
}


const errorPageSelector = {
    '404': Custom404,
    '500': Custom500
}

const BasePage = ({meta, data, error}: BasePageProps) => {
    if (error) {
        // @ts-ignore
        const ErrorPage = errorPageSelector[error.code] || CustomError;
        return <ErrorPage {...error}/>;
    }

    if (!data) {
        console.warn("No 'data' in props");
        return null;
    }

    if (!meta || !meta.type) {
        console.warn("BasePage props are missing 'meta.type'. Falling back to default page type.");

    } else if (meta.type.startsWith('media:')) {
        return null;
    }

    // @ts-ignore
    const SelectedPage = pageSelector[meta.type] || DefaultPage;
    return <SelectedPage {...data} />;
};

export default BasePage;

