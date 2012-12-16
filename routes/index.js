/**
 * Route class
 */

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
    
    return route.getApp();
}

module.exports = {
    bind: bindOnRoute
};
