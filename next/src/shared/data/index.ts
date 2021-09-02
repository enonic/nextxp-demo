export const fetchContent = async <T>(
    apiUrl: string,
    body: {}
): Promise<T> => {
    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    };

    return await fetch(apiUrl, options)
        .then(async (res: Response) => {
            if (!res.ok) {
                throw new Error(JSON.stringify({
                    code: res.status,
                    message: `Data fetching failed (message: '${res.statusText}')`
                }));
            }
            return (await res.json());
        })
        .then(async (json) => {
            if (!json) {
                throw new Error(JSON.stringify({
                    code: 404,
                    message: `API call completed but with empty data: ${JSON.stringify(json)}`
                }));
            }
            return json as T;
        });
}
