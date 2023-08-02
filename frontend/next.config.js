/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'http://192.168.10.121/:path*'
          }
        ]},
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