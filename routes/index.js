/**
 * Route class
 */

var controllers = require('../controllers');
var itemControllers = controllers.item
  , userControllers = controllers.user;
var Route = require("./route");

function bindOnRoute(app) {
    var route = new Route(app);

    //error
    route.addErrorHandler(function(err, callback) {
        if(err.code == 404) {
            callback(null, err.code, err.msg);
        }
        else {
            callback(null);
        }
    });

    //add route handler here
    route.addHandler('get', '/', function(req, callback) {
        callback(null, {view:'index', data:{ title: 'Express' }});
    });
    route.addHandler('get', '/test', function(req, callback) {
        callback(null, {view:'index', data:{ title: 'Test' }});
    });

    //item
    route.addHandler('get', '/item', function(req, callback) {
        var query = {};
        var options = {
            p : req.query.p || 1
        };
        itemControllers.get(query, options, function(err, reply) {
            callback(err, {view:'items', data:{title: 'Items', items: reply}});
        });
    });


    route.addHandler('post', '/item/:id', function(req, callback){
        var itemId = req.params.id;
        itemControllers.add(itemId, function(err, reply){
            callback(err, reply);
        });
    });

    route.addHandler('get', '/item/:id', function(req, callback){
        var itemId = req.params.id;
        itemControllers.retrieve(itemId, function(err, reply) {
            if(!reply) {
                callback({code: 404, msg: 'item id: ' + itemId + ' not found'}, {view: 'item', data: {}});
            }
            else {
                callback(err, {view:'item', data:{title: 'item - ' + reply.title, item: reply}});
            }
        });
    });

    //user
    route.addHandler('get', '/login/taobao', function(req, callback){
        userControllers.loginFromTaobao(req.query, callback);
    });
    
    return route.getApp();
}


module.exports = {
    bind: bindOnRoute
};
