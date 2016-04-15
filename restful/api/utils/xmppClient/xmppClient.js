/*********************************
    *description:对xmpp再次封装使用
    *author:殷光飞
    *mail:guangfei.me@gmail.com
*********************************
*/
var xmpp = require('node-xmpp');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var qbox = require('qbox');

var STATUS = {
    AWAY: "away",
    DND: "dnd",
    XA: "xa",
    ONLINE: "online",
    OFFLINE: "offline"
};



module.exports = new SimpleXMPP();

function SimpleXMPP() {
    //setting status here
    this.STATUS = STATUS;
    var self = this;
    this.Element = xmpp.Element;
    var config;
    var conn;
    var probeBuddies = {};
    var sendBuddies = {};
    var joinedRooms = {};
    var capabilities = {};
    var capBuddies = {};
    var iqCallbacks = {};
    var $ = qbox.create();
    var events = new EventEmitter();
    this.on = function() {
        events.on.apply(events, Array.prototype.slice.call(arguments));
    };
    this.removeListener = function(){
        events.removeListener.apply(events, Array.prototype.slice.call(arguments));
    };

    this.events = events;
    this.conn = conn;
    //发送消息
    this.send = function(to,message,callback) {
        sendBuddies[to] = true;
        $.ready(function() {
            var group=undefined;
            //服务器端测试
            var stanza =  new xmpp.Element(message.options.stanza_type,{type:message.options.msg_type,to:to})
                        .c(message.options.node_type,{type:message.options.msg_cmd,xmlns:message.options.xmlns}).t(JSON.stringify(message.json));  //创建新结点
            //本地测试
            //var stanza = new xmpp.Element('iq',{type:'set',to:to})
            //            .c('command',{type:"UPDATE",xmlns:'http://www.sunwayland.com.cn/athena'}).t(JSON.stringify(message));  //创建新结点
            //收到回复时触发事件
            events.once('send_' + to,callback);
            conn.send(stanza);
        });
    };
    /*
    this.join = function(to) {
        $.ready(function() {
            var room = to.split('/')[0];
            if(!joinedRooms[room]){
                joinedRooms[room] = true;
            }
            var stanza =  new xmpp.Element('presence', { to: to }).
            c('x', { xmlns: 'http://jabber.org/protocol/muc' });
            conn.send(stanza);
        });
    };
    */
    this.subscribe = function(to) {

        $.ready(function() {
            var stanza = new xmpp.Element('presence', { to: to, type: 'subscribe' });
            conn.send(stanza);
        });
    };

    this.unsubscribe = function(to) {

        $.ready(function() {
            var stanza = new xmpp.Element('presence', { to: to, type: 'unsubscribe' });
            conn.send(stanza);
        });
    };

    this.acceptSubscription = function(to) {

        // Send a 'subscribed' notification back to accept the incoming
        // subscription request
        $.ready(function() {
            var stanza = new xmpp.Element('presence', { to: to, type: 'subscribed' });
            conn.send(stanza);
        });
    };

    this.acceptUnsubscription = function(to) {

        $.ready(function() {
            var stanza = new xmpp.Element('presence', { to: to, type: 'unsubscribed' });
            conn.send(stanza);
        });
    };

    this.getRoster = function() {

        $.ready(function() {
            var roster = new xmpp.Element('iq', { id: 'roster_0', type: 'get' });
            roster.c('query', { xmlns: 'jabber:iq:roster' });
            conn.send(roster);
        });
    };

    this.probe = function(buddy, callback) {
        //为了保证事件触发时是当前bud不登大雅之堂y的
        probeBuddies[buddy] = true;
        $.ready(function() {
            var stanza = new xmpp.Element('presence', {type: 'probe', to: buddy});
            events.on('probe_' + buddy, callback);
            conn.send(stanza);
            
        });
    };

    function parseVCard(vcard) {
        //it appears, that vcard could be null
        //in the case, no vcard is set yet, so to avoid crashing, just return null
        if (!vcard) {
            return null;
        }
        return vcard.children.reduce(function(jcard, child) {
            jcard[child.name.toLowerCase()] = (
                (typeof(child.children[0]) === 'object') ?
                    parseVCard(child) :
                    child.children.join('')
            );
            return jcard;
        }, {});
    }
    //获取好友vcard
    this.getVCard = function(buddy, callback) {
        $.ready(function() {
            var id = 'get-vcard-' + buddy.split('@').join('--');
            var stanza = new xmpp.Element('iq', { type: 'get', id: id }).
                c('vCard', { xmlns: 'vcard-temp' }).
                up();
            iqCallbacks[id] = function(response) {
                if(response.attrs.type === 'error') {
                    callback(null);
                } else {
                    callback(parseVCard(response.children[0]));
                }
            };
            conn.send(stanza);
        });
    };


   this.getVCardForUser = function(jid, user, callback) {
        $.ready(function() {
            var id = 'get-vcard-' + user.split('@').join('-');
            var stanza = new xmpp.Element('iq', { from: jid, type: 'get', id: id, to: user }).
                c('vCard', { xmlns: 'vcard-temp' }).
                up();
            iqCallbacks[id] = function(response) {
                if(response.attrs.type === 'error') {
                    callback(null);
                } else {
                    var responseObj = {
                        vcard: parseVCard(response.children[0]),
                        jid: jid,
                        user: user
                    };
                    callback(responseObj);
                }
            };
            conn.send(stanza);
        });
    }

    this.setPresence = function(show, status) {
        $.ready(function() {
            var stanza = new xmpp.Element('presence');
            if(show && show !== STATUS.ONLINE) {
                stanza.c('show').t(show);
            }
            if(typeof(status) !== 'undefined') {
                stanza.c('status').t(status);
            }
            conn.send(stanza);
        });
    };

    

    // TODO: document!
    //
    // Options:
    //   * skipPresence - don't send initial empty <presence/> when connecting
    //
    
    
    this.disconnect = function() {
        $.ready(function() {
            var stanza = new xmpp.Element('presence', { type: 'unavailable' });
            stanza.c('status').t('Logged out');
            conn.send(stanza);
        });
            
        var ref = this.conn.connection;
        if (ref.socket.writable) {
            if (ref.streamOpened) {
                ref.socket.write('</stream:stream>');
                delete ref.streamOpened;
            } else {
                ref.socket.end();
            }
        }
    };
    
    this.connect = function(params) {

        config = params;
        conn = new xmpp.Client(params);
        self.conn = conn;

        conn.on('close', function() {
            $.stop();
            events.emit('close');
        });

        conn.on('online', function(data){
            if(! config.skipPresence) {
                conn.send(new xmpp.Element('presence'));
            }
            events.emit('online', data);
            $.start();
            // keepalive
            if(self.conn.connection.socket) {
              self.conn.connection.socket.setTimeout(0);
              self.conn.connection.socket.setKeepAlive(true, 10000);
            }
        });
        conn.on('stanza', function(stanza) {
            //触发stanza事件
            events.emit('stanza', stanza);
            if(stanza.is('presence')) {
                var from = stanza.attrs.from;
                if(from) {
                  if(stanza.attrs.type == 'subscribe') {
                      //handling incoming subscription requests
                      events.emit('subscribe', from);
                  } else if(stanza.attrs.type == 'unsubscribe') {
                      //handling incoming unsubscription requests
                      events.emit('unsubscribe', from);
                  } else {
                      //looking for presence stenza for availability changes
                      var id = from.split('/')[0];
                      var resource = from.split('/')[1];
                      var statusText = stanza.getChildText('status');
                      var state = (stanza.getChild('show'))? stanza.getChild('show').getText(): STATUS.ONLINE;
                      state = (state == 'chat')? STATUS.ONLINE : state;
                      state = (stanza.attrs.type == 'unavailable')? STATUS.OFFLINE : state;
                      
                      //checking if this is based on probe
                      if(probeBuddies[id]) {///
                          events.emit('probe_' + id,state,from);
                          delete probeBuddies[id];
                      } 
                  }
                }
            } else if (stanza.is('iq')) {
                //触发发送后状态的监听事件
                var from = stanza.attrs.from;
                // 保证用户不会乱
                if(sendBuddies[from]) {///
                    events.emit('send_' + stanza.attrs.from,stanza.attrs.type,stanza.attrs.from);
                    delete sendBuddies[from];
                } 
            }
        });

        conn.on('error', function(err) {
            //当与服务器断开连接时，将自动重连
            console.log("connect xmppServer error:::",err);
            //events.emit('error', err);
        });
    };
}

// Allow for multiple connections
module.exports.SimpleXMPP = SimpleXMPP;