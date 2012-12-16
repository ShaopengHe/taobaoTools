/**
 * config
 * User: peng
 * Date: 12-12-15 下午11:14
 */

var taobaoApp = {
    key: '12309206',
    secret: 'a6f988fe659e9b76a6fc4f749b13b9b3'
};

var redis = {
    host: 'localhost',
    port: '6379'
};

var config = {
    port:  8080,
    taobaoApp: taobaoApp,
    redis: redis
}

module.exports  = config;