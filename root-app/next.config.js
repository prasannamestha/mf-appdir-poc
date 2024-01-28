const NextFederationPlugin = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(new NextFederationPlugin({
      name: 'root-app',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {
        labeler: `labeler@http://localhost:3000/_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`,
      },
      exposes: {},
      // shared: ["react", "react-dom"],
      exposes: {
        './Button': './src/components/Button.tsx',
      },
      extraOptions: {
        exposePages: false,
      },
    }))
    return config;
  },
};