/**
 * item controller
 * User: peng
 * Date: 12-12-16 下午3:15
 */

var logger = require('log4js').getLogger(__filename);
var itemStream = require('../stream/item_stream');
var itemApi = require('../apis/taobao/item');

var Item = function() {
};

Item.prototype.add = function (itemId, cbf) {
    itemStream.emit(itemStream.ITEM_STATE_COLLECT, itemId);
    cbf(null, {itemId: itemId});
};

Item.prototype.retrieve = function (itemId, cbf) {
    itemStream.emit(itemStream.ITEM_STATE_RETRIEVE, itemId, cbf);
};

Item.prototype.get = function (query, opts, cbf) {
    var limit = 20;
    var options = {
        limit : limit,
        skip : limit * (opts.p - 1),
        sort : {_id : -1}
    };
    var fields = {
        itemId : 1,
        title : 1,
        pic_url : 1,
        freight_payer : 1
    };
    itemApi.find(query, fields, options, function(err, items){
        cbf(err, items);
    });
};

module.exports = new Item();