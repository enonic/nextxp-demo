

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
                    message: `Data fetching failed (message: '${await res.text()}')`
                }));
            }

            let json;
            try {
                json = await res.json();
            } catch (e) {
                throw new Error(JSON.stringify({
                    code: 500,
                    message: `API call completed but with non-JSON data: ${JSON.stringify(await res.text())}`
                }));
            }

            if (!json) {
                throw new Error(JSON.stringify({
                    code: 500,
                    message: `API call completed but with unexpectedly empty data: ${JSON.stringify(await res.text())}`
                }));
            }

            return json as T;
        });
};


export const fetchGuillotine = async (apiUrl, body, key, methodKeyFromQuery = 'get') => {
    const result = await fetchFromApi(
        apiUrl,
        body
    )
        .then(json => {
            let errors = (json || {}).errors;

            if (errors) {
                if (!Array.isArray(errors)){
                    errors = [errors];
                }
                errors.forEach(error => {
                    console.error(error);
                });

                return {error: {code: 500, message: `Server responded with ${errors.length} error(s), probably from guillotine - see message(s) above and server log.`}};
            }

            if (!(((json || {}).data || {}).guillotine || {})[methodKeyFromQuery]) {
                console.error('404 - not found.\nResponse from _contentMeta API:\n', json);
                return {error: {code: 404, message: "Not found"}};
            }

            return {
                [key]: json.data.guillotine[methodKeyFromQuery]
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

    // console.log("fetchGuillotine result:", result);

    return result;
};
