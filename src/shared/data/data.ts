// Shape of content base-data API body
export type ContentApiBaseBody = {
    query?: string,                 // Override the default base-data query
    variables?: {                   // GraphQL variables inserted into the query
        path?: string,              // Full content item _path
    }
};

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

type GuillotineResponse = {
    // @ts-ignore
    error?: {
        code: number,
        message: string
    },
    [dataKey: string]: {}
}

export const fetchGuillotine = async (
    apiUrl: string,
    body: ContentApiBaseBody,
    key: string,
    path: string,
    requiredMethodKeyFromQuery?: string
): Promise<GuillotineResponse> => {
    if (typeof body.query !== 'string' || !body.query.trim()) {
        // @ts-ignore
        return await {
            error: {
                code: 400,
                message: `Invalid or missing query. JSON.stringify(query) = ${JSON.stringify(body.query)}`
            }
        };
    }

    const result = await fetchFromApi(
        apiUrl,
        body
    )
        .then(json => {
            let errors: any[] = (json || {}).errors;

            if (errors) {
                if (!Array.isArray(errors)) {
                    errors = [errors];
                }
                console.warn(`${errors.length} error(s) when trying to fetch data (path = ${JSON.stringify(path)}):`);
                errors.forEach(error => {
                    console.error(error);
                });
                console.warn(`Query:\n${body.query}`);
                console.warn(`Variables: ${JSON.stringify(body.variables, null, 2)}`);

                // @ts-ignore
                return {
                    error: {
                        code: 500,
                        message: `Server responded with ${errors.length} error(s), probably from guillotine - see log.`
                    }
                };
            }

            // @ts-ignore
            const guillotineData = ((json || {}).data || {}).guillotine || {};
            if (Object.keys(guillotineData).length === 0) {
                console.warn(`Empty/unexpected data from guillotine API (path = ${JSON.stringify(path)}).\nResponse:\n`, json);
                return {error: {code: 404, message: "Not found"}};
            }
            if (requiredMethodKeyFromQuery && !guillotineData[requiredMethodKeyFromQuery]) {
                console.warn(`Empty/unexpected data from guillotine API (path = ${JSON.stringify(path)}).\nResponse:\n`, json);
                return {error: {code: 404, message: "Not found"}};
            }

            const data = requiredMethodKeyFromQuery
                ? json.data.guillotine[requiredMethodKeyFromQuery]
                : json.data.guillotine;

            return {
                [key]: data
            };

        })
        .catch((err) => {
            console.warn(`Client-side error when trying to fetch data (path = ${JSON.stringify(path)})`, err);
            try {
                return {error: JSON.parse(err.message)};
            } catch (e2) {
                return {error: {code: "Client-side error", message: err.message}}
            }
        });

    return result as GuillotineResponse;
};
