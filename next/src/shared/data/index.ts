const fetchFromApi = async <T>(
    apiUrl: string,
    body: {},
    method = "POST"
): Promise<T> => {
    const options = {
        method,
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
};


export const fetchContent = async (apiUrl, body, methodKeyFromQuery = 'get') => {
    const result = await fetchFromApi(
        apiUrl,
        body
    )
        .then(json => {
            if (!(((json || {}).data || {}).guillotine || {})[methodKeyFromQuery]) {
                console.error('404 - not found.\nResponse from _contentBase API:\n', json);
                return {error: {code: 404, message: "Not found"}};
            }

            return {
                contentBase: json.data.guillotine[methodKeyFromQuery]
            };
        })
        .catch((err) => {
            console.error(err);
            try {
                return {error: JSON.parse(err.message)};
            } catch (e2) {
                return {error: {code: "Local error", message: err.message}}
            }
        });

    // console.log("fetchContent result:", result);

    return result;
};
