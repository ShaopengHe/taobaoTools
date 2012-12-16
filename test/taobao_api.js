/**
 * taobao api test
 * User: peng
 * Date: 12-12-16 下午2:50
 */

var config = require('../config');

var topClient = require('top.js').createClient({
    app_key: config.taobaoApp.key
  , app_secret: config.taobaoApp.secret
  , debug: true
})

topClient.query('taobao.item.get', {
    fields: 'detail_url,num_iid,title,nick,type,cid,seller_cids,props,input_pids,input_str,desc,pic_url,num,valid_thru,list_time,delist_time,stuff_status,location,price,post_fee,express_fee,ems_fee,has_discount,freight_payer,has_invoice,has_warranty,has_showcase,modified,increment,approve_status,postage_id,product_id,auction_point,property_alias,item_img,prop_img,sku,video,outer_id,is_virtual'
  , num_iid: 17605091810
}, function(err, o) {
  if (err) console.error(err)
  else console.log(o)
})