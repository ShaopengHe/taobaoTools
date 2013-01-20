/**
 * User: peng
 * Date: 13-1-20 下午7:59
 */
var fs = require('fs');
var request = require('request');
var Util = function() {
    
};

Util.prototype.getImage = function(url, path, callback){
    request(url, function(err, response, body){
        callback(err, body);
    }).pipe(fs.createWriteStream(path));
};

Util.prototype.ensureDir = function(path, callback) {
    fs.exists(path, function(exists){
        if(exists) {
            callback(null, true);
        }
        else {
            fs.mkdir(path, 0700, function(err){
                if(err) {
                    callback(err);
                }
                else {
                    callback(null, false);
                }
            });
        }
    });
};

Util.prototype.getFileNameSuffix = function(name) {
    pos = name.lastIndexOf('.');
    if(pos > -1) {
        return name.substr(pos+1);
    }
    else {
        return '';
    }
};

module.exports = new Util();
//module.exports.ensureDir('/media/2D229FFE51810A59/taobao_pics/test', function(err, exists){
//    console.log(err);
//    console.log(exists);
//});
