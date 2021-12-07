import React from "react";

import {FetchContentResult} from "../guillotine/fetchContent";

import DefaultContentView from "../../customXp/contentTypes/_DefaultView";

import {getTypeSelection} from "../../customXp/contentSelector";
import {TypeSelection} from '../../customXp/_selectorTypes';


const BaseContent = (props: FetchContentResult) => {
    const {content, meta, page} = props;

    if (!content) {
        console.warn("No 'content' data in BasePage props");
        return null;
    }

    if (!meta || !meta.type) {
        console.warn("BasePage props are missing 'meta.type'. Falling back to _Default view type.");
    }

    const typeSelection: TypeSelection | undefined = getTypeSelection(meta.type)
    const SelectedPage = typeSelection?.view;

    if (SelectedPage) {
        // there is a renderer defined for this type
        return <SelectedPage content={content} page={page}/>
    } else if (meta.hasController) {
        // there is a page controller for this type
        return <DefaultContentView content={content} page={page}/>
    }

    console.info('BaseContent: no next renderer or page controller');
    return null;
}

export default BaseContent;
