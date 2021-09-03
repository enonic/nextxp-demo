const {contentNotFoundError404} = require('./errors');
const guillotineLib = require('/lib/guillotine');
const {CORS_HEADERS} = require("../cors-headers");



exports.executeResult = (siteId, branch, query, variables) => {
    // TODO: app repo is targeted - should that be overridable?

    log.info("{siteId, branch, query, variables} (" +
    	(Array.isArray({siteId, branch, query, variables}) ?
    		("array[" + {siteId, branch, query, variables}.length + "]") :
    		(typeof {siteId, branch, query, variables} + ({siteId, branch, query, variables} && typeof {siteId, branch, query, variables} === 'object' ? (" with keys: " + JSON.stringify(Object.keys({siteId, branch, query, variables}))) : ""))
    	) + "): " + JSON.stringify({siteId, branch, query, variables}, null, 2)
    );
    const content = guillotineLib.execute({query, variables, siteId, branch});

    return contentNotFoundError404(content, variables, query) ||
        {
            status: 200,
            body: content,
            contentType: 'application/json',
            headers: CORS_HEADERS
        };
};
