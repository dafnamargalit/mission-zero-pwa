module.exports = {
  reactStrictMode: true,
}

const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

module.exports = {
  webpack: (config, { isServer }) => {
      if (!isServer) {
          // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
          config.resolve.alias.https = "https-browserify";
          config.resolve.alias.http = "http-browserify";
          config.resolve.alias.stream = "stream-browserify";
          config.resolve.alias.zlib = "browserify-zlib";
          config.resolve.fallback = {
              fs: false,
              crypto: false
          }

      }

      return {...config, node: undefined};
  }
}
