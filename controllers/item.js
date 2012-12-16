/**
 * item controller
 * User: peng
 * Date: 12-12-16 下午3:15
 */

var itemApi = require('../apis/taobao/item');

var Item = function(){
    
};

Item.prototype.add = function (itemId, cbf) {
    var fields = ["detail_url", "num_iid", "title", "nick", "type", "cid", "seller_cids", "props", "input_pids", "input_str", "desc", "pic_url", "num", "valid_thru", "list_time", "delist_time", "stuff_status", "location", "price", "post_fee", "express_fee", "ems_fee", "has_discount", "freight_payer", "has_invoice", "has_warranty", "has_showcase", "modified", "increment", "approve_status", "postage_id", "product_id", "auction_point", "property_alias", "item_img", "prop_img", "sku", "video", "outer_id", "is_virtual"];
    itemApi.collect(itemId, fields.join(','), function(err, item) {
       cbf(err, item);
    });
};


module.exports = new Item();