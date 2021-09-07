const guillotineLib = require('/lib/guillotine');
const graphqlPlaygroundLib = require('/lib/graphql-playground');
const { CORS_HEADERS } = require("../lib/headless/cors-headers");


//──────────────────────────────────────────────────────────────────────────────
// Methods
//──────────────────────────────────────────────────────────────────────────────
exports.options = function () {
    return {
        contentType: 'text/plain;charset=utf-8',
        headers: CORS_HEADERS
    };
};

exports.get = function (req) {
    if (req.webSocket) {
        return {
            webSocket: {
                data: guillotineLib.createWebSocketData(req),
                subProtocols: ['graphql-ws']
            }
        };
    }

    let body = graphqlPlaygroundLib.render();
    return {
        contentType: 'text/html; charset=utf-8',
        body: body
    };
};



exports.post = function (req) {
    let input = JSON.parse(req.body);

    log.info("\ninput.query (" +
    	(Array.isArray(input.query) ?
    		("array[" + input.query.length + "]") :
    		(typeof input.query + (input.query && typeof input.query === 'object' ? (" with keys: " + JSON.stringify(Object.keys(input.query))) : ""))
    	) + "): " + JSON.stringify(input.query, null, 2)
    );
    log.info("\ninput.variables (" +
    	(Array.isArray(input.variables) ?
    		("array[" + input.variables.length + "]") :
    		(typeof input.variables + (input.variables && typeof input.variables === 'object' ? (" with keys: " + JSON.stringify(Object.keys(input.variables))) : ""))
    	) + "): " + JSON.stringify(input.variables, null, 2)
    );

    let params = {
        query: input.query,
        variables: input.variables
    };

    return {
        contentType: 'application/json',
        headers: CORS_HEADERS,
        body: guillotineLib.execute(params)
    };
};

exports.webSocketEvent = guillotineLib.initWebSockets();
