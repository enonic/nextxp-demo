

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

            return json;
        });
};


export const fetchGuillotine = async<T> (apiUrl, body, key, idOrPath, methodKeyFromQuery):Promise<T> => {
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
                console.warn(`${errors.length} error(s) when trying to fetch data (idOrPath = ${JSON.stringify(idOrPath)}):`);
                errors.forEach(error => {
                    console.error(error);
                });

                return {error: {code: 500, message: `Server responded with ${errors.length} error(s), probably from guillotine - see log.`}};
            }

            console.log(methodKeyFromQuery);
            console.log(json);
            console.log(json.data);
            console.log(json);
            console.log(json.data.guillotine);
            console.log(json.data.guillotine[methodKeyFromQuery]);

            if (!(((json || {}).data || {}).guillotine || {})[methodKeyFromQuery]) {
                console.warn(`Empty or unexpected data when trying to fetch data (idOrPath = ${JSON.stringify(idOrPath)}).\nResponse from _contentMeta API:\n`, json);
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
