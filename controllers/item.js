/**
 * item controller
 * User: peng
 * Date: 12-12-16 下午3:15
 */

var logger = require('log4js').getLogger(__filename);
var itemStream = require('../stream/item_stream');

var Item = function() {
};

Item.prototype.add = function (itemId, cbf) {
    itemStream.emit(itemStream.ITEM_STATE_COLLECT, itemId);
    cbf(null);
};

Item.prototype.retrieve = function (itemId, cbf) {
    itemStream.emit(itemStream.ITEM_STATE_RETRIEVE, itemId, cbf);
};

module.exports = new Item();