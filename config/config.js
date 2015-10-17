/*jshint node: true */
'use strict';

var _ = require('lodash');

/**
 * config
 * todo::需要封装属性、方法，如 getConfig() 之类的
 * @type {Object}
 */
var config = {
    /**
     * global config
     */
    global: {
        // VERSION: 'ali-foundation/0.0.1'
    },
    /**
     * local config
     */
    local:{
        G_SERVER: '//localhost:9000'
    },
    /**
     * production config
     */
    production: {
        G_SERVER: '//www.examplecdn.com'
    }
};


/**
 * local is defalut
 * @param  {[type]} env [development environment]
 * @return {[type]}     [description]
 */
module.exports = function(env){
    return _.extend(config.global, config[env || 'local']);
};
