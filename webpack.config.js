module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/cfh.vox.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader", options: { transpileOnly: true } }
        ]
    }
}