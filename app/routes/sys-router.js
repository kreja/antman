'use strict';
/**
 * 系统级别路由
 * @type {[type]}
 */
var CommonController = require('../controllers/common-controller');

var router = new ( require('koa-router') )();

// router.get('/', CommonController.empty);
router.get('/favicon.png', CommonController.empty);
router.get('/favicon.ico', CommonController.empty);

module.exports = router;
