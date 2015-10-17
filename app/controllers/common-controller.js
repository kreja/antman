'use strict';

/**
 * 空方法
 * @yield {[type]} [description]
 */
exports.empty = function* (next) {
    this.response.set('cache-control', 'max-age=315360000');
    this.body = '';
    return;
}
