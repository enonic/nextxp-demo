const httpClient = require('/lib/http-client');
const portalLib = require('/lib/xp/portal')
const frontendOrigin = "http://localhost:3000" // <- hardcode for poc

const loopbackCheckParam = 'fromXp';

const errorResponse = function(url, status, message) {
    const msg = `Failed to fetch from frontend: ${url} - ${status}: ${message}`;
    if (status >= 400) {
        log.error(msg);
    }

    return {
        contentType: 'text/html',
        body: `<div>${msg}</div>`,
        status,
    };
};

// This proxies requests made directly to XP to the frontend. Normally this will
// only be used in the portal-admin content studio previews
const frontendProxy = function(req) {


    const isLoopback = req.params[loopbackCheckParam];
    if (isLoopback) {
        log.info(`Loopback to XP detected from path ${req.rawPath}`);
        return {
            contentType: 'text/html',
            body: `<div>Error: request to frontend looped back to XP</div>`,
            status: 200,
        };
    }

    const pathStartIndex = req.rawPath.indexOf(req.branch) + req.branch.length;

    // this isn't likely to show up at when not working with Enonic's stuff.
    // const contentPath = req.rawPath; //.slice(pathStartIndex).replace('/www.nav.no', '');

    // NAV uses the content's rawPath. That may or may not be useful.
    // For right now, I'll just use the id which makes querying
    // simpler.
    const content = portalLib.getContent();
    const contentPath = "/" + content._id

    const frontendPath = req.branch === 'draft' ? `/draft${contentPath}` : contentPath;
    const frontendUrl = `${frontendOrigin}${frontendPath}?${loopbackCheckParam}=true`;


    try {
        const response = httpClient.request({
            url: frontendUrl,
            contentType: 'text/html',
            connectionTimeout: 5000,
            headers: {
                secret: "it's not a secret anymore!"
            },
            body: JSON.stringify({ variables: {} }),
            followRedirects: false,
        });

        if (!response) {
            return errorResponse(frontendUrl, 500, 'No response from HTTP client');
        }

        const status = response.status;
        const message = response.message;

        if (status >= 400) {
            log.info(`Error response from frontend for ${frontendUrl}: ${status} - ${message}`);
        }

        // Do not send redirect-responses to the content-studio editor view,
        // as it may cause iframe cross-origin errors
        if (req.mode === 'edit' && status >= 300 && status < 400) {
            return errorResponse(frontendUrl, status, 'Redirects are not supported in editor view');
        }

        return response;
    } catch (e) {
        log.error(e);
        //return errorResponse(frontendUrl, 500, `Exception: ${e}`);
    }

    return {
        contentType: 'text/html',
        body: `<div><h1>Success!</h1><p>Triggered the frontend proxy!</p></div>`,
        status: 200,
    };
};

exports.get = frontendProxy;
exports.handleError = frontendProxy;
