export default function CustomError({code, message}) {
    return <>
        <h1>Ooops</h1>
        <p>An error occurred:</p>
        <p>{code} - {message}</p>
    </>
}
