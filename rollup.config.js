import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import path from 'path';

const outDir = 'es';
const config = {
    input: 'src/index.ts',
    treeshake: {
        propertyReadSideEffects: false,
    },
    output: {
        dir: outDir,
        format: 'es',
        freeze: false,
        esModule: true,
        sourcemap: true,
        exports: 'named',
    },
    external: (id) => {
        if (id.startsWith('regenerator-runtime') || id === 'tslib') {
            return false;
        }
        return !id.startsWith('.') && !path.isAbsolute(id);
    },
    plugins: [nodeResolve(), typescript({ outDir, declaration: false, declarationMap: false, module: 'esnext' })],
};

export const getConfig = (namespace = 'plasma') => ({
    ...config,
    plugins: [
        ...config.plugins,
        getBabelOutputPlugin({
            plugins: [
                'babel-plugin-annotate-pure-calls',
                [
                    'babel-plugin-styled-components',
                    {
                        displayName: false,
                        namespace,
                    },
                ],
            ],
        }),
    ],
});

export default config;
