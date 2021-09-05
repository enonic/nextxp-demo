const {contentNotFoundError404} = require('./errors');
const guillotineLib = require('/lib/guillotine');
const {CORS_HEADERS} = require("../cors-headers");



exports.executeResult = (siteId, branch, query, variables) => {

    // TODO: app repo is targeted via siteId - should that be overridable?
    const content = guillotineLib.execute({query, variables, siteId, branch});

    return contentNotFoundError404(content, variables, query) ||
        {
            status: 200,
            body: content,
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
};
