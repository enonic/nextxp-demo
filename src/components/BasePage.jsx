import React from 'react';

import typeSelector from "../selectors/typeSelector";




/////////// Inline styles

const defaultStyle = { padding: "10px" };
const errorStyle = { padding: "10px", color: "#611" };
const codeDumpStyle = { width: "100%", whiteSpace: "pre-wrap", wordWrap: "break-word" };



/////////// Default view: dump props data to screen

const DefaultPage = (props) => {
    return (
        <div style={defaultStyle}>
            <h1>{props.displayName}</h1>
            <h5>Props:</h5>
            <pre style={codeDumpStyle}>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}



////////////// Error view

const ErrorPage = (errorProps) => {
    return (
        <div style={errorStyle}>
            <h1>Error</h1>
            <pre style={codeDumpStyle}>
                {JSON.stringify(errorProps, null, 2)}
            </pre>
        </div>
    )
}


////////////// Main entry: select view by error state / content type

const BasePage = ({content, meta={}, error}) => {
    if (error) {
        return <ErrorPage {...error}/>;
    }

    if (!content) {
        console.warn("No 'content' data in BasePage props");
        return null;
    }

    const {type} = meta;
    if (!type) {
        console.debug("BasePage props are missing 'meta.type'. Falling back to DefaultPage component.");
    }

    const typeSelection = typeSelector[type]
    const SelectedPage = typeSelection?.page || DefaultPage;

    return <SelectedPage {...content} />;
};

export default BasePage;
