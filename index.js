var events = require('events'),
	emitter = new events.EventEmitter();

var toXML = require('./lib/toXML');
var toJSON = require('./lib/toJSON');
var checkSign = require('./lib/checkSign');

/**
 * 基础类
 * @param token
 * @constructor
 */
function WX(token){
	this.token = token;
	this.res = null;
}
/**
 * 验证sign
 * @param req
 * @param res
 * @returns {*}
 */
WX.prototype.checkSign = function(req, res){
	if(req.method === 'GET')
		return checkSign(this.token, req, res);
}
// 初始化
WX.prototype.init = function(req, res){
	var self = this;
	self.res = res;
	var data = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk){
		data += chunk;
	});

	req.on('end', function(){
		self.toJSON(data);
	});

};

['text', 'image', 'voice', 'video', 'location', 'link', 'event'].forEach(function(name){
	WX.prototype[name] = function(fn){
		emitter.on(name, fn);
		return this;
	}
});
// 监听所有信息
WX.prototype.all = function(fn){
	emitter.on("text", fn);
	emitter.on("image", fn);
	emitter.on("location", fn);
	emitter.on("link", fn);
	emitter.on("event", fn);
	emitter.on("voice", fn);
	emitter.on("video", fn);

	return this;
}

WX.prototype.toXML = toXML;
WX.prototype.toJSON = function(data){
	var message = toJSON(data);
	emitter.emit(message.msgType, message);
};
// 消息回复
WX.prototype.send = function(data){
	this.res.writeHead(200, {'Content-Type': 'text/plain'});
	this.end(toXML(data));
	return this;
}

// 接口
module.exports = function(token){
	return new WX(token);
}