/**
 * 使用本地 build 中的资源，使用前先 build
 */

module.exports = {
    devServer: {
        contentBase: './build',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};
