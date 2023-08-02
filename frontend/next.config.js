/** @type {import('next').NextConfig} */
const nextConfig = {

    "headers": [
        {
          "source": "/(.*)",
          "headers": [
            { "key": "Access-Control-Allow-Credentials", "value": "true" },
            { "key": "Access-Control-Allow-Origin", "value": "*" },
            { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
          ]
        }
      ]    ,
        webpack: (config, { isServer }) => {
        if (!isServer) {
            // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false
            }
        }

        return config;
    }

}

module.exports = nextConfig