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
    data?: {
        type: string
    }
    fetching?: boolean
}


const errorPageSelector = {
    404: Custom404,
    500: Custom500
}

const BasePage = ({error, data, fetching}: BasePageProps) => {
    if (error) {
        const ErrorPage = errorPageSelector[error.code] || CustomError;
        return <ErrorPage code={error.code} message={error.message}/>;
    }

    if (fetching) {
        return <p className="spinner">Fetching data...</p>
    }

    if (!data) {
        if (!fetching) {
            console.warn("No 'data' in props");
        }
        return null;
    }

    if (!data.type) {
        console.warn("A 'type' attribute is missing from the data. Most likely, a query is added without a type attribute at the content top level.");
        /// ...but still render the SelectedPage, which will dump the data.

    } else if (data.type.startsWith('media:')) {
        return null;
    }

    const SelectedPage = pageSelector[data.type] || DefaultPage;
    return <SelectedPage {...data} />;
};

export default BasePage;
