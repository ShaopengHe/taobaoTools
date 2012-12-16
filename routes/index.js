/**
 * Route class
 */

var controllers = require('../controllers');
var itemControllers = controllers.item;
var Route = require("./route");

function bindOnRoute(app) {
    var route = new Route(app);

    //add route handler here
    route.addHandler('get', '/', function(req, callback) {
        callback(null, {view:'index', data:{ title: 'Express' }});
    });
    route.addHandler('get', '/test', function(req, callback) {
        callback(null, {view:'index', data:{ title: 'Test' }});
    });

    //item
    route.addHandler('post', '/item/:id', function(req, callback){
        var itemId = req.params.id;
        itemControllers.add(itemId, function(err, reply){
            callback(err, reply);
        })
    });
    
    return route.getApp();
}


module.exports = {
    bind: bindOnRoute
};
