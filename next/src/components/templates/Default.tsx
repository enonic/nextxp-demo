import React from "react"

type Props = {
    displayName: string,
}

const DefaultPage = (props: Props) => {
    return (
        <>
            <p>Content item:</p>
            <h2>{props.displayName}</h2>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </>
    )
}

export default DefaultPage;
