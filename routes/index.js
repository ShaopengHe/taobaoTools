/**
 * Route class
 */

var controllers = require('../controllers');
var itemControllers = controllers.item;
var Route = require("./route");

function bindOnRoute(app) {
    var route = new Route(app);

    //add route handler here
    route.addHandler('get', '/', function(req, res) {
        res.render('index', { title: 'Express' })
    });
    route.addHandler('get', '/test', function(req,res) {
        res.end('test');
    });

    //item
    route.addHandler('get', '/item/:id', function(req, res, next){
        var itemId = req.params.id;
        itemControllers.add(itemId, function(err, item){
            if(err) {
                next(err);
            }
            else {
                res.end(JSON.stringify(item));
            }
        })
    });
    
    return route.getApp();
}

module.exports = {
    bind: bindOnRoute
};
