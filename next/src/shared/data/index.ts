export const fetchContent = async<T> (
    apiUrl: string,
    body: {}
): Promise<T> => {

    return await fetch(apiUrl, {
        method: "post",
        body: JSON.stringify(body),
    })
        .then(async (res: Response) => {
            if (!res.ok) {
                throw new Error(
                    `Data fetching failed. Error: ${JSON.stringify(await res.json())}`
                );
            }
            return (await res.json());
        })
        .then(async (json) => {
            if (!json) {
                throw new Error(
                    `Data fetching failed. No data: ${JSON.stringify(json)}`
                );
            }
            return json as T;
        });
}
