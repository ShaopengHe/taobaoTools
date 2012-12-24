/**
 * user controller
 * User: peng
 * Date: 12-12-24 下午5:51
 */
var crypto = require('crypto');
var querystring = require('querystring');
var logger = require('log4js').getLogger(__filename);
var async = require('async');
var userApi = require('../apis/user');
var config = require('../config');

var User = function() {
};

/**
 * login from taobao
 * @param params
 * @param cbf
 */
User.prototype.loginFromTaobao = function (params, cbf) {
    var topParameters = params.top_parameters
        , topSession = params.top_session
        , topSign = params.top_sign;
    var errRedirect = {url: 'http://container.api.taobao.com/container?appkey=21335375'};

    var verified = isValidTopSign(config.taobaoApp.key, config.taobaoApp.secret, topParameters, topSession, topSign);
    //无效签名
    if (!verified) {
        cbf(null, null, errRedirect);
    }
    else {
        topParameters = querystring.parse(new Buffer(topParameters, 'base64').toString('utf8'));
        if (isTopParametersExpired(topParameters.ts)) {
            cbf(null, null, errRedirect);
        }
        else {
            var username = topParameters.visitor_nick;
            async.waterfall([
                function(callback) {
                    userApi.retrieve(username, function(err, user) {
                        callback(err, user);
                    });
                },
                function(user, callback) {
                    //update topSession
                    if (user) {
                        userApi.update(username, {topSession: topSession, topRefreshToken: topParameters.refresh_token}, function(err){
                            if(err) {
                                callback(err);
                            }
                            else {
                                user.topSession = topSession;
                                user.topRefreshToken = topParameters.refresh_token;
                                callback(null, user);
                            }
                        });
                    }
                    else {
                        //signUp user
                        var userInfo = {
                            username: username,
                            password: topParameters.visitor_id,
                            topId: topParameters.visitor_id,
                            topSession: topSession,
                            topRefreshToken: topParameters.refresh_token
                        };
                        userApi.signUp(userInfo, callback);
                    }
                }
            ], function(err, user) {
                if (err) {
                    logger.error(err);
                    cbf(null, null, errRedirect);
                }
                else {
                    cbf(null, user);
                }
            });
        }
    }
};

function isTopParametersExpired(ts) {
    return Date.now() - ts > 1000 * 60 * 30;    //半小时过期
}
;

function isValidTopSign(appKey, appSecret, topParameters, topSession, topSign) {
    var md5Sum = crypto.createHash('md5');
    md5Sum.update(appKey + topParameters + topSession + appSecret, 'utf8');
    return md5Sum.digest('base64') === topSign;
}

module.exports = new User();