import { apiUrl } from '../../../enonic.connection.config';



const fetchContent = async<T> (
    idOrPath: string,
    branch?: string,
    overrideQuery?: string,
    variables?: string
): Promise<T> => {
    return await fetch(apiUrl, {
        method: "post",
        body: JSON.stringify({
            idOrPath,
            branch,
            overrideQuery: overrideQuery || null,
            variables: variables || null
        }),
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
