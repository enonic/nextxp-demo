import React from 'react';

import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/Error';

import DefaultPage from "../components/templates/Default";
import { pageSelector} from "../shared/pageSelector";

const selectPage = (contentType) => pageSelector[contentType] || DefaultPage;

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

const BasePage = ({error, data, fetching}: BasePageProps) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message}/>;
    }

    if (fetching) {
        return <p className="spinner">Fetching data...</p>
    }

    if (data) {
        const SelectedPage = selectPage(data.type);
        return <SelectedPage {...data} />
    }

    return null;
};

export default BasePage;
