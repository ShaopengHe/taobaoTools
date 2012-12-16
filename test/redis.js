/**
 * redis test
 * User: peng
 * Date: 12-12-16 下午5:38
 */

var redis = require("../databases/redis/redis"),
    client1 = new redis(), client2 = new redis(),
    msg_count = 0;

client1.on("subscribe", function (channel, count) {
    client2.publish("a nice channel", "I am sending a message.");
    client2.publish("a nice channel", "I am sending a second message.");
    client2.publish("a nice channel", "I am sending my last message.");
});

client1.on("message", function (channel, message) {
    console.log("client1 channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        client1.unsubscribe();
        client1.end();
        client2.end();
    }
});

client1.incr("did a thing");
client1.subscribe("a nice channel");