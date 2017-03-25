const path = require("path");
module.exports = {
    entry: [
        "./src/index.tsx"
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: process.env.WEBPACK_DEVTOOL || "source-map",
    output: {
        path: path.join(__dirname, "public", "build"),
        publicPath: "/build/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: [
                    "babel-loader",
                    "ts-loader"
                ]
            }
        ]
    }
};
