/**
 * taobao item apis
 * User: peng
 * Date: 12-12-16 下午3:26
 */
var config = require('../../config');

var Item = function() {
    this.client = require('top.js').createClient({
        app_key: config.taobaoApp.key
        , app_secret: config.taobaoApp.secret
        , debug: false
    });
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

module.exports = new Item();