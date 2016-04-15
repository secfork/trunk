/*********************************
    *description:用户向xmmpp服务器发送消息
    *author:殷光飞
    *mail:guangfei.me@gmail.com
*********************************
*/
var xmpp = require('./xmppClient'),
    Timeout = require('node-timeout');

var limit_send = Timeout(5000, {
    http: false,
    err: new Error('ER_SEND_TIME_OUT')
});
module.exports = Xmpp;

function Xmpp(connectionOptions) {
    xmpp.connect(connectionOptions);
    this.max_queue_len_ = 10;
    this.queue_ = [];
    this.busy_ = false;
};
Xmpp.prototype.send = function(user,message,cb){
    var self = this;
    function send_timeOut(type,from){
        if(type =='result'){
            self.nextEvent();
            cb();
        }else{
            self.nextEvent();
            cb("ER_SEND_MESSAGE_ERROR");
        }
    }
    //如果用户在线，向在线用户发送信息
    xmpp.send(user,message,limit_send(send_timeOut));
}


Xmpp.prototype.handleEvent = function(user,message,cb ) {
    if (!this.busy_) {
        this.busy_ = true;
        this.send(user,message,cb);
        return;
    }

    if (this.queue_.length < this.max_queue_len_) {
        this.queue_.push({
            user : user,
            message : message,
            cb:cb
        });
    }
};

Xmpp.prototype.nextEvent = function() {
    var self = this;
    if (this.queue_.length) {
        var evt = this.queue_.shift();
        setImmediate(function(){
            self.send(evt.user, evt.message, evt.cb);
        });
    }
    else{
        this.busy_ = false;
    }
};