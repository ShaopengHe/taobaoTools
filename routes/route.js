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
    return this.app[method](path, handler);
}

module.exports = Route;
