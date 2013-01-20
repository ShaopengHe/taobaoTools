/**
 * item stream
 * User: peng
 * Date: 12-12-21 上午12:53
 */

var events = require('events');
var util = require('util');
var itemApi = require('../apis/taobao/item');
var logger = require('log4js').getLogger(__filename);

var ItemStream = function () {
    this.ITEM_STATE_COLLECT = 'item:collect';
    this.ITEM_STATE_STORE = 'item:store';
    this.ITEM_STATE_RETRIEVE = 'item:retrieve';
    this.ITEM_STATE_COLLECT_PICS = 'item:collect:pics';
    this.retryTimes = 3;
};

util.inherits(ItemStream, events.EventEmitter);


var itemStream = new ItemStream();

/**
 * collect item
 */
itemStream.on(itemStream.ITEM_STATE_COLLECT, function(itemId, tryTimes) {
    if (!tryTimes) {
        tryTimes = this.retryTimes;
    }
    var fields = ["detail_url", "num_iid", "title", "nick", "type", "cid", "seller_cids", "props", "input_pids", "input_str", "desc", "pic_url", "num", "valid_thru", "list_time", "delist_time", "stuff_status", "location", "price", "post_fee", "express_fee", "ems_fee", "has_discount", "freight_payer", "has_invoice", "has_warranty", "has_showcase", "modified", "increment", "approve_status", "postage_id", "product_id", "auction_point", "property_alias", "item_img", "prop_img", "sku", "video", "outer_id", "is_virtual"];
    itemApi.collect(itemId, fields.join(','), function(err, item) {
        if (err) {
            logger.error(err);
            if (tryTimes) {
                logger.debug('retry...');
                itemStream.emit(itemStream.ITEM_STATE_COLLECT, itemId, --tryTimes);
            }
        }
        else {
            itemStream.emit(itemStream.ITEM_STATE_STORE, itemId, item.item);
        }
    });
});

/**
 * store item
 */
itemStream.on(itemStream.ITEM_STATE_STORE, function(id, item, tryTimes) {
    if (!tryTimes) {
        tryTimes = this.retryTimes;
    }
    itemApi.update(id, item, function(err, item) {
        if (err) {
            logger.error(err);
            if (tryTimes) {
                logger.debug('retry...');
                itemStream.emit(itemStream.ITEM_STATE_STORE, id, itemId, --tryTimes);
            }
        }
        else {
            logger.info("collect item: " + id + ' success');
            itemStream.emit(itemStream.ITEM_STATE_COLLECT_PICS, id);
        }
    });
});

/**
 * retrieve item
 */
itemStream.on(itemStream.ITEM_STATE_RETRIEVE, function(id, tryTimes, cbf) {
    if (!cbf && typeof tryTimes === 'function') {
        cbf = tryTimes;
        tryTimes = this.retryTimes;
    }
    itemApi.retrieve(id, function(err, item) {
        if (err) {
            logger.error(err);
            if (tryTimes) {
                logger.debug('retry...');
                itemStream.emit(itemStream.ITEM_STATE_RETRIEVE, id, --tryTimes, cbf);
            }
            else {
                logger.error('retrieve item: ' + id + 'faild');
                cbf(err);
            }
        }
        else {
            logger.info("retrieve item: " + id + ' success');
            cbf(null, item);
        }
    });
});


itemStream.on(itemStream.ITEM_STATE_COLLECT_PICS, function(id, tryTimes, cbf) {
    if (!cbf && typeof tryTimes === 'function') {
        cbf = tryTimes;
        tryTimes = this.retryTimes;
    }
    if (!cbf) {
        cbf = function() {
        };
    }
    itemApi.collectImages(id, function(err) {
        if (err) {
            logger.error(err);
            if (tryTimes) {
                logger.debug('retry...');
                itemStream.emit(itemStream.ITEM_STATE_COLLECT_PICS, id, --tryTimes, cbf);
            }
            else {
                logger.error('collect images item: ' + id + 'faild');
                cbf(err);
            }
        }
        else {
            logger.info("collect images item: " + id + ' success');
            cbf(null);
        }
    });
});

module.exports = itemStream;