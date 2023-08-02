/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '//192.168.10.121:8545/:path*',
            destination: 'http://192.168.10.121:3000/:path*',
          },
        ]
      },
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