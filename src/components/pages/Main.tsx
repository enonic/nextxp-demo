import type {PageProps} from '@enonic/nextjs-adapter';
import React from 'react'
import RegionsView from '@enonic/nextjs-adapter/views/Region';

const MainPage = (props: PageProps) => {
    const page = props.page;
    const regions = (!page.regions || !Object.keys(page.regions).length) ? {
        main: {
            name: 'main',
            components: [],
        }
    } : page.regions;
    
    return (
        <>
            <RegionsView {...props} page={{...page, regions}} name="main"/>
        </>
    );
};

export default MainPage;
