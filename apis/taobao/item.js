/**
 * taobao item apis
 * User: peng
 * Date: 12-12-16 下午3:26
 */
var config = require('../../config');
var MongoDB = require('../../databases/mongodb');

var Item = function() {
    this.collectionName = 'items';
    this.client = require('top.js').createClient({
        app_key: config.taobaoApp.key
        , app_secret: config.taobaoApp.secret
        , debug: false
    });
    this.mongodbClient = new MongoDB();
};

Item.prototype.collect = function(itemId, fields, cbf) {
    if (!itemId || !fields) {
        cbf('require params: "itemId" and "fields"');
    }
    else {
        this.client.query('taobao.item.get', {
            fields: fields
            , num_iid: itemId
        }, cbf);
    }
};

Item.prototype.update = function(itemId, newObj, cbf) {
    if(!newObj.updatedAt) {
        newObj.updatedAt = Date.now();
    }
    this.mongodbClient.update(this.collectionName, {itemId: itemId}, {$set: newObj}, {upsert: true}, cbf);
};

Item.prototype.retrieve = function(itemId, cbf) {
    this.mongodbClient.find(this.collectionName, {itemId: itemId}, cbf);
};

module.exports = new Item();