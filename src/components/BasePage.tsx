import React from 'react';

import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/Error';

import DefaultPage from "../components/pagetypes/_Default";
import {pageSelector} from "../selectors/pageSelector";


export type BasePageProps = {
    error?: {
        code: string,
        message: string
    },
    type?: string,
    data?: {
        type: string
    }
    fetching?: boolean
}


const errorPageSelector = {
    404: Custom404,
    500: Custom500
}

const BasePage = ({type, data, error}: BasePageProps) => {
    if (error) {
        const ErrorPage = errorPageSelector[error.code] || CustomError;
        return <ErrorPage {...error}/>;
    }

    if (!data) {
        console.warn("No 'data' in props");
        return null;
    }

    if (!type) {
        console.warn("BasePage props are missing 'type'. Falling back to default page type.");

    } else if (type.startsWith('media:')) {
        return null;
    }

    const SelectedPage = pageSelector[type] || DefaultPage;
    return <SelectedPage {...data} />;
};

export default BasePage;
