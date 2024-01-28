const NextFederationPlugin = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(new NextFederationPlugin({
      name: 'labeler',
      filename: 'static/chunks/remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.tsx',
      },
      remotes: {
        rootApp: `root-app@http://localhost:3001/_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`,
      },
      shared: {},
    }))
    return config;
  },
};