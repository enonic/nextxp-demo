const { contentNotFoundError404 } = require('validation');
const guillotineLib = require('/lib/guillotine');


exports.executeResult = (siteId, branch, query, variables) => {
    // TODO: app repo is targeted - should that be overridable?
    const content = guillotineLib.execute({ query, variables, siteId, branch });

    return contentNotFoundError404(content, variables, query) ||
        {
            status: 200,
            body: content,
            contentType: 'application/json',
        };
};
