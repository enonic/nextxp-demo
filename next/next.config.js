const {apiDomain} = require("./enonic.connection.config");

module.exports = {
  reactStrictMode: true,
  async headers() {
        return [
            {
                source: '/:contentPath*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: "*",
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: "Content-Type",
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: "GET,POST,OPTIONS",
                    },
                ],
            },
        ]
    },
}
