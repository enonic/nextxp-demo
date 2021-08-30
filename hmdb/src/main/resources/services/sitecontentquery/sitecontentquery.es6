const { query } = require('../../lib/headless/guillotine/sitecontent');

exports.get = (req) => {
    return {
        contentType: 'text/plain',
        body: query
    }
};
