/** @type {import('next').NextConfig} */

function getEnonicWebpackConfig(config, {buildId, dev, isServer, defaultLoaders, nextRuntime, webpack}) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        // client-side resolution for node modules
        fs: false
    }
    return config;
}

async function getEnonicHeaders() {
    return [
        {
            // Apply these headers to all routes in your application.
            source: '/:path*',
            headers: [
                {
                    key: 'Content-Security-Policy',
                    value: `script-src 'self' 'unsafe-eval' 'unsafe-inline';`
                }
            ],
        },
    ]
}

const config = {
    reactStrictMode: true,
    trailingSlash: false,
    transpilePackages: ['@enonic/nextjs-adapter'],
    webpack: getEnonicWebpackConfig,
    headers: getEnonicHeaders,
};

module.exports = config;
