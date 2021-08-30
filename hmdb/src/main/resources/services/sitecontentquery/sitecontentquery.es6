const { query } = require('../../lib/headless/guillotine/sitecontent');

const contentLib = require('/lib/xp/content');

const result = contentLib.get({key: "3a7b833f-3c37-4d55-88ae-cea21c556c68"});

log.info("result: " + JSON.stringify(result));

exports.get = (req) => {
    return {
        contentType: 'text/plain',
        body: query
    }
};
