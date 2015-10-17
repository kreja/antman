'use strict';
var parse = require('co-body');
var _ = require('lodash');

var messages = [
    { id: 0, message: 'Koa next generation web framework for node.js' },
    { id: 1, message: 'Koa is a new web framework designed by the team behind Express' }
];

module.exports.home = function *home() {
    var outData = {
        proName: 'static-message',
        pageName: 'index',
        pageTitle: 'Message',
        host: this.config.G_SERVER
    };

    outData = _.extend(outData, { 'messages': messages });
    yield this.render('message/list', outData);
};

module.exports.list = function *list() {
    this.body = yield messages;
};

module.exports.fetch = function *fetch(id) {
    var message = messages[id];
    if (!message) {
        this.throw(404, 'message with id = ' + id + ' was not found');
    }
    this.body = yield message;
};

module.exports.create = function *create() {
    var message = yield parse(this);
    var id = messages.push(message) - 1;
    message.id = id;
    this.redirect('/');
};

function doSomeAsync() {
    return function (callback) {
        setTimeout(function () {
            callback(null, 'this was loaded asynchronously and it took 3 seconds to complete');
        }, 3000);
    };
}

// One way to deal with asynchronous call
module.exports.delay = function *delay() {
    this.body = yield doSomeAsync();
};
