/**
 * Route class
 * User: peng
 * Date: 12-12-15 下午11:48
 */

var Route = function (app) {
    this.app = app;

};

Route.prototype.getApp = function () {
    return this.app;
}

Route.prototype.addHandler = function (method, path, handler) {
    return this.app[method](path, function(req, res, next) {
        handler(req, function(err, data, redirect) {
            if(redirect) {
                res.redirect(redirect.url, redirect.status);
            }
            else {
                responseHandler(err, data, req, res, next);
            }
        });
    });
}


function responseHandler(err, data, req, res, next) {
    //ajax
    if (req.xhr || !data || !data.view) {
        var respo = {
            code: err ? -1 : 0,
            msg: err ? err : 'success',
            data: err ? null : data
        };
        res.end(JSON.stringify(respo));
    }
    else {
        if(err) {
            next(err);
        }
        else {
            res.render(data.view, data.data || {});
        }
    }
}

module.exports = Route;
