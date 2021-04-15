/* eslint-disable */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer({
    compress: true,
    webpack(config, { webpack }) {
        const __prod__ = process.env.NODE_ENV === "production";
        return {
            ...config,
            mode: __prod__ ? "production" : "development",
            devtool: __prod__ ? "hidden-source-map" : "eval",
            plugins: [...config.plugins, new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)]
        };
    }
});
