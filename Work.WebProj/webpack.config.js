var path = require('path');
var webpack = require('webpack');

var m = process.env.NODE_ENV;
var p = null;
var ent = {
    //基礎功能
    member: path.resolve(__dirname, 'Scripts/src/member/app.js'),
    login: path.resolve(__dirname, 'Scripts/src/login/app.js'),

    vendors: ['jquery', 'react',  'moment', path.resolve(__dirname, 'Scripts/comm/comm-run')]
};
module.exports = {
    entry: ent,
    output: {
        path: path.resolve(__dirname, 'Scripts/build/app'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'babel' },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    resolve: {
        alias: {
            moment: "moment/moment.js"
        },
        modules: ["app_modules", "node_modules"],
        extensions: ['*', '.js', '.jsx', '.json', '.css']
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'vendor',
        //    filename: 'vendors.js'
        //}),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/)
        //new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ]
};