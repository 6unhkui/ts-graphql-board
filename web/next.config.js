/* eslint-disable */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer({
    compress: true,
    webpack(config, { webpack }) {
        const isProd = process.env.NODE_ENV === "production";
        return {
            ...config,
            mode: isProd ? "production" : "development",
            devtool: isProd ? "hidden-source-map" : "eval",
            plugins: [...config.plugins, new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)]
        };
    }
});
