/**
 * taobao item apis
 * User: peng
 * Date: 12-12-16 下午3:26
 */
var async = require('async');
var config = require('../../config');
var MongoDB = require('../../databases/mongodb');
var util = require('../util/util');
var logger = require('log4js').getLogger(__filename);

var ITEM_IMAGES_PATH = '/media/2D229FFE51810A59/taobao_pics/';

var Item = function() {
    this.collectionName = 'items';
    this.client = require('top.js').createClient({
        app_key: config.taobaoApp.key
        , app_secret: config.taobaoApp.secret
        , debug: false
    });
    this.mongodbClient = new MongoDB();
};

Item.prototype.find = function (query, fields, options, cbf) {
    this.mongodbClient.find(this.collectionName, query, fields, options, cbf);
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
    if (!newObj.updatedAt) {
        newObj.updatedAt = Date.now();
    }
    this.mongodbClient.update(this.collectionName, {itemId: itemId}, {$set: newObj}, {upsert: true}, cbf);
};

Item.prototype.retrieve = function(itemId, cbf) {
    this.mongodbClient.find(this.collectionName, {itemId: itemId}, function(err, items) {
        cbf(err, items[0]);
    });
};

/**
    collect item images' src
    cbf (err, srcs)
*/
Item.prototype.collectImagesSrc = function(itemId, cbf) {
    var self = this;
    async.waterfall([
        function(callback) {
            self.retrieve(itemId, function(err, item) {
                if(err || !item) {
                    callback(err || 'item not found');
                } else {
                    callback(null, item);
                }
            });
        }, 
        function(item, callback) {
            var imageSrcs = [];
            if(item.pic_url) {
                imageSrcs.push(item.pic_url);
            }
            if(item.item_imgs && item.item_imgs.item_img) {
                var tmp = item.item_imgs.item_img;
                for(var i = 0, len = tmp.length; i < len; i++) {
                    imageSrcs.push(tmp[i].url);
                }
            }
            if(item.prop_imgs && item.prop_imgs.prop_img) {
                var tmp = item.prop_imgs.prop_img;
                for(var i = 0, len = tmp.length; i < len; i++) {
                    imageSrcs.push(tmp[i].url);
                }
            }
            //get image from item 
            util.getImagesSrc(item.desc, function(err, imagesUrl) {
                imageSrcs = imageSrcs.concat(imagesUrl);
                callback(null, imageSrcs);
            });
        }
    ], function(err, result) {
        if(err) {
            logger.error(err);
            result = [];
        }
        cbf(null, result);
    });
};

Item.prototype.collectImages = function(itemId, cbf) {
    var self = this;
    async.waterfall([
        function(callback) {
            self.retrieve(itemId, function(err, item) {
                if (err || !item) {
                    callback(err || 'item not found');
                }
                else {
                    callback(null, item);
                }
            });
        },
        function(item, callback) {
            var itemImagesData = {id:item.itemId, images:[]};
            if (item.pic_url) {
                itemImagesData.images.push(item.pic_url);
            }
            if (item.item_imgs && item.item_imgs.item_img) {
                var tmp = item.item_imgs.item_img;
                for (var i = 0, len = tmp.length; i < len; i++) {
                    itemImagesData.images.push(tmp[i].url);
                }
            }
            if (item.prop_imgs && item.prop_imgs.prop_img) {
                var tmp = item.prop_imgs.prop_img;
                for (var i = 0, len = tmp.length; i < len; i++) {
                    itemImagesData.images.push(tmp[i].url);
                }
            }
            //get image from item 
            util.getImagesSrc(item.desc, function(err, imagesUrl) {
                itemImagesData.images = itemImagesData.images.concat(imagesUrl);
                callback(null, itemImagesData);
            });
        },
        function(itemImagesData, callback) {
            var path = ITEM_IMAGES_PATH + itemImagesData.id;
            util.ensureDir(path, function(err) {
                if (err) {
                    callback(err);
                }
                else {
                    itemImagesData.path = path + '/';
                    callback(null, itemImagesData);
                }
            });
        },
        function(itemImagesData, callback) {
            var i = 0;
            async.forEachLimit(itemImagesData.images, 10, function(itemUrl, callback) {
                (function(i) {
                    var targetPath = itemImagesData.path + i + '.' + util.getFileNameSuffix(itemUrl);
                    util.getImage(itemUrl, targetPath, function(err) {
                        if (err) {
                            logger.error('item: ' + itemImagesData.id + ', url: ' + itemUrl + ' err: ');
                            logger.error(err);
                        }
                        else {
                            logger.trace('item: ' + itemImagesData.id + ', url: ' + itemUrl + ' to ' + targetPath);
                        }
                        callback(null);
                    });
                })(i++);
            }, function(err) {
                callback(err);
            });
        }
    ], function(err) {
        cbf(err);
    });
};

module.exports = new Item();
// setTimeout(function(){
//     module.exports.collectImagesSrc('15714454236', function(err, srcs){
//         console.log (srcs);
//     });
// }, 2000);
