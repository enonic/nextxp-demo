import queryKey from "./queryKey";


const fetchFromApi = async (
    apiUrl: string,
    body: {},
    method = "POST"
) => {
    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    };

    let res;
    try {
        res = await fetch(apiUrl, options);
    } catch (e) {
        console.warn(apiUrl, e);
        throw new Error(JSON.stringify({
            code: "API",
            message: e.message
        }));
    }

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

    return json;
};

export const fetchGuillotine = async <T>(apiUrl, body, key, idOrPath, methodKeyFromQuery): Promise<T> => {
    if (typeof body.query !== 'string' || !body.query.trim()) {
        return await {
            error: {
                code: 400,
                message: `Invalid or missing query. JSON.stringify(query) = ${JSON.stringify(body.query)}`
            }
        }
    }
    const result = await fetchFromApi(
        apiUrl,
        body
    )
        .then(json => {
            let errors = (json || {}).errors;

            if (errors) {
                if (!Array.isArray(errors)) {
                    errors = [errors];
                }
                console.warn(`${errors.length} error(s) when trying to fetch data (idOrPath = ${JSON.stringify(idOrPath)}):`);
                errors.forEach(error => {
                    console.error(error);
                });

                return {
                    error: {
                        code: 500,
                        message: `Server responded with ${errors.length} error(s), probably from guillotine - see log.`
                    }
                };
            }

            // @ts-ignore
            if (!(((json || {}).data || {}).guillotine || {})[methodKeyFromQuery]) {
                console.warn(`Empty/unexpected data from guillotine API (idOrPath = ${JSON.stringify(idOrPath)}).\nResponse:\n`, json);
                return {error: {code: 404, message: "Not found"}};
            }

            return {
                [key]: json.data.guillotine[methodKeyFromQuery]
            };
        })
        .catch((err) => {
            console.warn(`Client-side error when trying to fetch data (idOrPath = ${JSON.stringify(idOrPath)})`, err);
            try {
                return {error: JSON.parse(err.message)};
            } catch (e2) {
                return {error: {code: "Client-side error", message: err.message}}
            }
        });

    return result as T;
};
