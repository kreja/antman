/**
 * 基础配置文件
 */
'use strict';

/**
 * todo::
 * 指定编译文件夹
 */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var appConfig = {
    appName: 'gen-koa',
    app: 'front',
    dist: 'build',
    programWildcard: 'static-*' // 项目名通配
};

var excludeFromStats = [
    /node_modules[\\\/]/
];

function makeConf(options){
    options = options || {};
    var dev = options.dev !== undefined ? options.dev : true; // 默认是 开发阶段

    var entry = genEntries(dev);

    entry.vendor = ['jquery', 'bootstrapJs', 'bootstrapCss']; // 不需要打进入口文件的第三方包，这里指定了才会提取到 vendor 中

    var output = {
        path: path.resolve(__dirname, appConfig.dist),
        filename: '[name].js',
        publicPath: ''
    };
    var loaders = [
        {
            test: /\.ejs$/,
            loader: 'ejs-compiled'
        },{
            test: /\.s?css$/,
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass') // css 分离出来单独引入
        },{
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'url?limit=100000'
        },{
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&minetype=application/font-woff'
        },{
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&minetype=application/font-woff'
        },{
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&minetype=application/octet-stream'
        },{
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        },{
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&minetype=image/svg+xml'
        }
    ];
    var plugins = [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'), // 第三方包打成 vendor.js
        new webpack.ProvidePlugin({ // 每个模块都会有 $，而且不需要 require("jquery") 了
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('[name].css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            allChunks: false // todo::???
        })
    ];
    var alias = { // 可以 require('aliasname')
        jquery: path.resolve(appConfig.app) + '/bower_components/jquery/dist/jquery.js', // 就可以 require('jquery') 而不用整个路径了
        bootstrapJs: path.resolve(appConfig.app) + '/mods/darkly-ui/javascripts/bootstrap.js',
        bootstrapCss: path.resolve(appConfig.app) + '/mods/darkly-ui/stylesheets/bootstrap.css'
    };

    // 开发阶段
    if(dev){
        plugins = plugins.concat([
            new webpack.HotModuleReplacementPlugin()
        ]);
    }
    // build 阶段
    else{
        plugins = plugins.concat([
            new Clean([appConfig.dist]),
            new webpack.optimize.UglifyJsPlugin()
        ]);
    }

    return {
        entry: entry,
        output: output,
        module: {
            loaders: loaders
        },
        plugins: plugins,
        resolve: {
            alias: alias
        },
        devtool: options.devtool,
        debug: options.debug,
        devServer: { // 开发配置
            stats: { // 控制台
                cached: false,
                exclude: excludeFromStats,
                colors: true,
                // modules: true,
                // reasons: true
            },
            // hot: true, // 去掉之后，修改 html.  jade 才会刷新
            historyApiFallback: true, // todo::???
            inline: true,
            port: 9000
        },
        progress: true
    };
}

/**
* 获取入口文件
* @return {[type]} [description]
*/
function genEntries(dev) {
    var dirs = getAllDirs(appConfig.app, new RegExp(appConfig.programWildcard));
    var map = {};
    var names;

    dirs.forEach(function(dir){
        names = getAllFiles(dir);
        names.forEach(function(name) {
            var m = name.match(/(.+)\.js$/);
            var entry = m ? m[1] : '';
            var entryPath = entry ? path.resolve(appConfig.app + '/' + name) : '';

            if(entry){
                if(dev){
                    // 开发阶段，hot-mode 需要
                    // https://github.com/webpack/webpack/issues/418
                    map[entry] = ['webpack-dev-server/client?http://localhost:9000','webpack/hot/only-dev-server',entryPath];
                }else{
                    map[entry] = entryPath;
                }
            }
        });
    });

    return map;
}

/**
* 获取 root 下所有名字匹配 reg 的文件夹
* @param  {[type]} root [description]
* @return {[type]}      [匹配的文件夹的路径 如 path/to/front/mobile_service_daijia]
*/
function getAllDirs(root, reg){
    var res = [] , files = fs.readdirSync(root);

    files.forEach(function(file){
        var pathname = path.resolve(root+'/'+file);
        var stat = fs.lstatSync(pathname);

        if (stat.isDirectory() && reg.test(file)){
            res.push(pathname);
        }
    });

    return res;
}

/**
* 获取 root 下所有 js 文件
* @param  {[type]} root [description]
* @return {[type]}      [mobile_service_daijia/guide/index.js]
*/
function getAllFiles(root){
    var res = [] , files = fs.readdirSync(root);

    files.forEach(function(file){
        var pathname = path.resolve(root+'/'+file);
        var stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()){
            res.push(pathname.replace(path.resolve(appConfig.app)+'/',''));
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });

    return res;
}

module.exports = makeConf;
