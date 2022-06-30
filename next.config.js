// neededed to eval inline react scripts
const cspHeaders = [
    {
        key: 'Content-Security-Policy',
        value: `script-src 'self' 'unsafe-eval' 'unsafe-inline';`
    }
]

const nextConfig = {
    reactStrictMode: true,
    images: {
        loader: 'custom',
        domains: ['localhost'], // update/add the url of xp image server
        deviceSizes: [400, 800, 1200, 1920],
        imageSizes: [16, 48, 96, 128],
    },

    webpack: (config, {isServer}) => {
        if (!isServer) {
            // fs is server only
            config.resolve.fallback.fs = false
        }

        return config
    },

    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: '/:path*',
                headers: cspHeaders,
            },
        ]
    },
}

module.exports = nextConfig;
