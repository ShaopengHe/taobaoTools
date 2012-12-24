/**
 * User
 * User: peng
 * Date: 12-12-24 下午5:06
 */

var crypto = require('crypto')
    , shasum = crypto.createHash('sha256')
    , MongoDB = require('../../databases/mongodb');


var User = function () {
    this.collectionName = 'users';
    this.mongodbClient = new MongoDB();
};


User.prototype.signUp = function(user, cbf) {
    if (!user || !user.username || !user.username.length || !user.password || !user.password.length) {
        cbf('fields username && password are required.');
    }
    else {
        shasum.update(user.password, 'utf8');
        user.password = shasum.digest('hex');
        this.create(user, cbf);
    }
};

User.prototype.create = function(user, cbf) {
    if (!user.updatedAt) {
        user.updatedAt = Date.now();
    }
    if (!user.createdAt) {
        user.createdAt = Date.now();
    }
    this.mongodbClient.insert(this.collectionName, user, cbf);
};

User.prototype.login = function(username, password) {

};

module.exports = new User();

var user = new User();

setTimeout(function() {
    user.signUp({
        username:'ssad',
        password:'a',
        phone:123456
    }, function(err, user) {
        if (err) console.log(err);
        console.log(user);
    });
}, 1000);
