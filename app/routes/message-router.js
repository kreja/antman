/**
 * message router
 */
var ControllerDir = '../controllers/message/';

var msgController = require(ControllerDir + 'messages');

var router = new ( require('koa-router') )({prefix: ''});

router.get('/', msgController.home);
router.get('/messages', msgController.list);
router.get('/messages/:id', msgController.fetch);
router.post('/messages', msgController.create);
router.get('/async', msgController.delay);

module.exports = router;
