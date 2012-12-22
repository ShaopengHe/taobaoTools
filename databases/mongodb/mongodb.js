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

/**
 * insert
 * @param collection
 * @param doc
 * @param options
 * @param cbf
 */
MongoDB.prototype.insert = function(collection, doc, options, cbf) {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.db.collection(args.shift());
    collection.insert.apply(collection, args);
};

/**
 * update
 * @param collection
 * @param query
 * @param doc
 * @param options -- {upsert: boolean, multi: boolean, safe:boolean}
 * @param cbf
 */
MongoDB.prototype.update = function(collection, query, doc, options, cbf) {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.db.collection(args.shift());
    collection.update.apply(collection, args);
};

/**
 * find
 * @param collection
 * @param query
 * @param fields
 * @param options
 * @param cbf
 */
MongoDB.prototype.find = function(collection, query, fields, options, cbf) {
    var args = Array.prototype.slice.call(arguments);
    var collection = this.db.collection(args.shift());
    cbf = args.pop();
    var cursor = collection.find.apply(collection, args).toArray(cbf);
    
};

module.exports = MongoDB;
//var client = new MongoDB();

//setTimeout(
//    function() {
//        client.insert('test', {a:1});
//        var start = Date.now();
//        client.insert('test', {a:2, b:Math.random()}, function(err, docs) {
//            if (err) console.log(err);
//            console.log(Date.now() - start);
//            console.log(docs);
//        });
//        var start = Date.now()
//        client.update('test', {a:'update'}, {$set:{b:Math.random()}},{upsert:true}, function(err, docs) {
//            if (err) console.log(err);
//            console.log(Date.now() - start);
//            console.log(docs);
//        });
//        var start = Date.now()
//        client.update('test', {a:'update1'}, {$set:{b:Math.random()}},{upsert:true,safe:true}, function(err, docs) {
//            if (err) console.log(err);
//            console.log(Date.now() - start);
//            console.log(docs);
//        });
//        var start = Date.now()
//        client.find('test', {a:{$exists:true}},{_id:0},{skip:0,limit:20,sort:{b:1}}, function(err, doc){
//            if (err) console.log(err);
//            console.log(Date.now() - start);
//            console.log(doc);
//        });
//    }, 1000
//);
