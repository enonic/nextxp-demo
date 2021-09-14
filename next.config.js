var { apiDomain, nextDomain } = require('./src/enonic-connection-config');

module.exports = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: '/_(master|draft)/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: apiDomain,
                    },
                ],
            },
        ]
    },
    assetPrefix: nextDomain
}
