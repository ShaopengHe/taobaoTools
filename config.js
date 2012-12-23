/**
 * config
 * User: peng
 * Date: 12-12-15 下午11:14
 */

var taobaoApp = {
    key: 'xxxx',
    secret: 'xxxxx'
};

var redis = {
    host: 'localhost',
    port: '6379'
};

var mongodb = {
    host: 'localhost',
    port: '27017',
    database: 'taobao_tools'
};

var config = {
    port:  8080,
    taobaoApp: taobaoApp,
    redis: redis,
    mongodb: mongodb
}

module.exports  = config;