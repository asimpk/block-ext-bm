const CracoEsbuildPlugin = require("craco-esbuild");
module.exports = {
    plugins: [
        {
            plugin: CracoEsbuildPlugin,
            options: {
                esbuildMinimizerOptions: {
                    target: "es6",
                    css: true, //  OptimizeCssAssetsWebpackPlugin being replaced by esbuild.
                },
            },
        },
    ],
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            return {
                ...webpackConfig,
                entry: {
                    main: ['./src/polyfills.ts', env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
                    background: './src/chromeServices/background.ts',
                    content: './src/chromeServices/content.ts'
                },
                output: {
                    ...webpackConfig.output,
                    filename: '[name].js',
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }

        }

    }
}