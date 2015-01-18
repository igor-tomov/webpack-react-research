var webpack = require("webpack");

module.exports = {
    resolve: {
        alias: {
            styles:  __dirname + '/public/styles/less',
            modules: __dirname + "/public/js/modules",
            utils: __dirname + "/public/js/utils"
        }
    },

    entry: {
        vendors: [ "backbone", "backbone.nativeajax", "react", "reflux", './public/js/app' ],
        modules: [
            'modules/quiz',
            'modules/clocks',
            'modules/feed'
        ]
    },

    output: {
        path: __dirname + "/public/js/build",
        publicPath: "./public",
        filename: "[name].bundle.js"
    },

    externals: {
        jquery: {}
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
            { test: /\.jsx$/, loader: "jsx-loader" }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin( "vendors", "vendors.bundle.js" )
    ]
};