// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const babelrc = require('../.babelrc');

const resolveModule = (...fromPaths) => (...pathSegments) => path.resolve(...fromPaths, ...pathSegments);

const rootPath = path.resolve(__dirname, '..');
const packsPath = path.join(rootPath, 'packages');
const resolveInsidePackage = resolveModule(process.env.PACKAGE_DIR, 'node_modules');
const resolveFromRoot = resolveModule(rootPath, 'node_modules');
const resolveInsideCypressUtils = resolveModule(resolveFromRoot('@salutejs', 'plasma-cy-utils'), 'node_modules');

const dummyModule = `
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
`;

['plasma-web', 'plasma-b2c', 'plasma-ui'].forEach((pack) => {
    const packIndexPath = path.join(packsPath, pack, 'index.js');
    if (!fs.ensureFileSync(packIndexPath)) {
        fs.writeFileSync(packIndexPath, dummyModule);
    }
});

module.exports = function getWebpackConfig() {
    const babelOpts = { ...babelrc.env.cjs };

    if (process.env.PACKAGE_DIR.includes('plasma-temple')) {
        babelOpts.plugins.push('@babel/plugin-transform-regenerator', '@babel/transform-runtime');
    }

    return {
        mode: 'development',
        entry: 'src/index.ts',
        devtool: 'inline-source-map',
        devServer: { contentBase: './public' },
        resolve: {
            extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.jsx', '.json', '.map'],
            modules: ['node_modules'],
            alias: {
                'styled-components': resolveInsidePackage('styled-components'),
                react: resolveInsidePackage('react'),
                'react-dom': resolveInsidePackage('react-dom'),
                '@salutejs/plasma-icons': resolveInsidePackage('@salutejs', 'plasma-icons'),
                '@salutejs/plasma-cy-utils': resolveFromRoot('@salutejs', 'plasma-cy-utils'),
                '@salutejs/plasma-tokens': resolveInsideCypressUtils('@salutejs', 'plasma-tokens'),
                '@salutejs/plasma-tokens-b2b': resolveInsideCypressUtils('@salutejs', 'plasma-tokens-b2b'),
                '@salutejs/plasma-tokens-b2c': resolveInsideCypressUtils('@salutejs', 'plasma-tokens-b2c'),
                '@salutejs/plasma-tokens-web': resolveInsideCypressUtils('@salutejs', 'plasma-tokens-web'),
                '@salutejs/plasma-tokens-typo': resolveInsideCypressUtils('@salutejs', 'plasma-tokens-typo'),
            },
        },
        optimization: {
            minimize: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx$|\.ts$/,
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader',
                        options: babelOpts,
                    },
                },
                // В @salutejs/plasma-temple есть графические ассеты
                // лоадеры для них
                {
                    test: /\.svg$/,
                    use: 'file-loader',
                },
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                mimetype: 'image/png',
                            },
                        },
                    ],
                },
            ],
        },
    };
};
