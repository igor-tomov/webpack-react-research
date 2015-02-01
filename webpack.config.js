var webpack = require("webpack");

var ENV = process.env.NODE_ENV || 'development';

module.exports = {
    resolve: {
        alias: {
            styles:  __dirname + '/public/styles/less',
            modules: __dirname + "/public/js/modules",
            utils: __dirname + "/public/js/utils"
        }
    },

    entry: {
        common: [
            // vendors
            "underscore",
            "backbone",
            "backbone.nativeajax",
            "react",
            "reflux"
        ],

        modules: './public/js/app'
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
        new webpack.optimize.CommonsChunkPlugin( "common", "common.bundle.js" ),
        new webpack.DefinePlugin({
            ENV: JSON.stringify( ENV )
        })
    ]
};