'use strict';
var compress = require('koa-compress');
var logger = require('koa-logger');
var koa = require('koa');
var path = require('path');
var fs = require('fs');
var mount = require('koa-mount');
var render = require('koa-ejs');
var app = module.exports = koa();

/******************************************************
 * 开启 logger
 ******************************************************/
app.use(logger());


/******************************************************
 * 读取配置
 ******************************************************/
app.use(function *(next){
    var env = process.env.NODE_ENV;
    this.config = require('./config/config.js')(env);

    yield next;
});


/******************************************************
 * 配置模板
 ******************************************************/
render(app, {
  root: path.join(__dirname, '/app/views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true,
  filters: {}
});


/******************************************************
 * 处理异常
 ******************************************************/
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = 500;

    var outData = {
        layout: false,
        host: this.config.G_SERVER,
        proName: 'static-common',
        pageName: 'abnormal',
        pageTitle: '出错啦(;´༎ຶД༎ຶ`) ',
        errCode: 500,
        errMsg: '系统异常'
    };

    yield this.render('abnormal', outData);
    this.app.emit('error', err, this);
  }
});


/******************************************************
 * 添加 app/routes 下的路由
 ******************************************************/
// 创建一个应用
var msgApp = koa();

var routesPath = path.join(__dirname, '/app/routes');
fs.readdirSync(routesPath).forEach(function(file) {
  if(file[0] === '.') return;
  msgApp.use(require(routesPath + '/' + file).routes());
});

// 挂载到主 app
app.use(mount('/', msgApp));


/******************************************************
 * 处理 404
 ******************************************************/
app.use(function *(){
    this.status = 404;
    var outData = {
        layout: false,
        host: this.config.G_SERVER,
        proName: 'static-common',
        pageName: 'err404',
        pageTitle: '找不到该页面(;´༎ຶД༎ຶ`) '
    };
    yield this.render('err404', outData);
});


// Compress
app.use(compress());


/******************************************************
 * 启动服务
 ******************************************************/
if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
