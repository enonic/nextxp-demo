// pages/500.js
export default function Custom500({message}) {
    return <>
        <h1>500 - Server-side error occurred</h1>
        {message && <p>{message}</p>}
    </>
}
