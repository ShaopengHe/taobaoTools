/**
 * redis client
 * User: peng
 * Date: 12-12-16 下午4:55
 * TODO
 */

var redis = require('redis');
var config = require('../../config');
var logger = require('log4js').getLogger(__filename);

var Redis = function(options) {
    if(!options) {
        options = {};
    }
    this.client = redis.createClient(options.port || config.redis.port, options.host || config.redis.host);
    this.client.on('connect', options.connect || function() {
        logger.info('redis://' + this.host + ':' + this.port + ' is ready');
    });
    this.client.on('error', options.error || function(err) {
        logger.error('redis://' + this.host + ':' + this.port + ' err: ' + err);
    });
    return this.client;
};

module.exports = Redis;


