const guillotineLib = require('/lib/guillotine');
const graphqlPlaygroundLib = require('/lib/graphql-playground');
const libGraphQl = require('/lib/graphql');
const schema = require('../guillotine/schema/schema');

//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': '*'
};

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

//const schema = guillotineLib.createSchema();


exports.post = function (req) {

    let input = JSON.parse(req.body);

    //log.info("--------------> Query:\n" + input.query);
    const result = libGraphQl.execute(schema, input.query, input.variables);
    // log.info("<-------------- Result:{\n" + JSON.stringify(result, null, 2));

    return {
        contentType: 'application/json',
        headers: CORS_HEADERS,
        body: result
    };
};

exports.webSocketEvent = guillotineLib.initWebSockets();


/*
const guillotineLib = require('/lib/guillotine');
const libGraphQl = require('/lib/graphql');
const graphqlPlaygroundLib = require('/lib/graphql-playground');

//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const CORS_HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': '*'
};

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
*/
