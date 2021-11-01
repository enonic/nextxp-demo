import React from 'react';

import { fetchContent } from "../guillotine/fetchContent";

import BasePage from "../components/BasePage";

export const getServerSideProps = async (context) => {
    const {
        content = null,
        meta = null,
        error = null
    } = await fetchContent(context.params.contentPath, context);

    return {
        props: {
            content,
            meta,
            error,
        }
    }
};

export default BasePage;
