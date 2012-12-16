/**
 * mongo client
 * User: peng
 * Date: 12-12-16 下午9:58
 */

var mongodbNative = require('mongodb')
    , format = require('util').format
    , config = require('../../config').mongodb
    , logger = require('log4js').getLogger(__filename);

var MongoDB = function(options) {
    var self = this;
    if (!options) {
        options = {};
    }
    var url = format("mongodb://%s:%s/%s"
        , options.host || config.host
        , options.port || config.port
        , options.db || config.database);

    self.client = mongodbNative.MongoClient;
    self.client.connect(url, function(err, db) {
        if (err) {
            logger.error(err);
            throw err;
        }
        self.db = db;
        logger.info(format("mongodb://%s:%s/%s connected success."
            , self.db.serverConfig.host
            , self.db.serverConfig.port
            , self.db.databaseName
        ));
    })
};

MongoDB.prototype.insert = function(collection, doc, options, cbf) {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.db.collection(args.shift());
    collection.insert.apply(collection, args);
};

module.exports = MongoDB;
var client = new MongoDB();

setTimeout(
    function() {
//        client.insert('test', {a:1});
        var start = Date.now();
        client.insert('test', {b:2}, function(err, docs) {
            if (err) console.log(err);
            console.log(docs);
        });
        var start = Date.now()
        client.insert('test', {b:2}, {safe:true}, function(err, docs) {
            if (err) console.log(err);
            console.log(docs);
        });
    }, 1000
);
