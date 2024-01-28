# Module federation app dir POC

A simple POC - you need to update the node-modules files to get this working. This is a proof of concept for this PR: https://github.com/module-federation/universe/pull/2002/files

## Steps to run this:

```bash
$ cd labeler && npm install
$ npm run dev
```

The above should run the dev server for `labeler` project on port `3000`

Next, let's run the root-app project.

```bash
$ cd root-app && npm install
```

Now update this file:
`root-app/node_modules/@module-federation/enhanced/dist/src/lib/container/runtime/FederationRuntimePlugin.js` line number 107 to this:

```
  if (!entryItem.import.includes(entryFilePath) && entryItem.layer !== 'rsc') {
```

Next update file `root-app/node_modules/@module-federation/nextjs-mf/dist/src/plugins/NextFederationPlugin/next-fragments.js` line number 53 to this:

```
if ((0, helpers_1.hasLoader)(oneOfRule, 'react-refresh-utils') && oneOfRule.exclude) {
```

Finally, update the function `getNormalFederationPluginOptions` in `root-app/node_modules/@module-federation/nextjs-mf/dist/src/plugins/NextFederationPlugin/index.js` to this:

```javascript
getNormalFederationPluginOptions(compiler, isServer) {
        const hasAppDir = Object.keys(compiler.options.resolve.alias || {}).includes(
            'private-next-app-dir',
        );
        const defaultShared = (0, next_fragments_1.retrieveDefaultShared)(isServer);

        if (hasAppDir) {
            // These shared deps cause issues with the appDir. Any ideas around this?
            delete defaultShared['react'];
            delete defaultShared['react/'];
            delete defaultShared['react-dom'];
            delete defaultShared['react-dom/'];
        }
        const noop = this.getNoopPath();
        return {
            ...this._options,
            runtime: false,
            remoteType: 'script',
            // @ts-ignore
            runtimePlugins: [
                //@ts-ignore
                ...(this._options.runtimePlugins || []),
                require.resolve(path_1.default.join(__dirname, '../container/runtimePlugin')),
            ],
            exposes: {
                './noop': noop,
                './react': require.resolve('react'),
                './react-dom': require.resolve('react-dom'),
                './next/router': require.resolve('next/router'),
                ...this._options.exposes,
                ...(this._extraOptions.exposePages
                    ? (0, nextPageMapLoader_1.exposeNextjsPages)(compiler.options.context)
                    : {}),
            },
            remotes: {
                ...this._options.remotes,
            },
            shared: {
                ...defaultShared,
                ...this._options.shared,
            },
        };
    }
```

Now run `$ npm run dev` this shall load the root-app server on port 3001. Remote components from `labeler` should be loaded here.
