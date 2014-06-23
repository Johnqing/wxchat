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
	var valid = checkSign(this.token, req);
	// 签名错误返回
	if(!valid.isSign){
		res.writeHead(401);
		res.end('Invalid signature');
		return;
	}
	if(req.method !== 'GET') return this;
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(valid.echostr);
	return this;
}
// 初始化
WX.prototype.middlewarify = function(req, res){
	this.res = res;
	this.checkSign(req, res);
	var method = req.method;
	if(method === 'POST'){
		var self = this;
		var xml = '';

		req.setEncoding('utf8');
		req.on('data', function(chunk){
			xml += chunk;
		});
		req.on('end', function(){
			self.toJSON(xml);
		});
		return;
	}

	if(method === 'GET') return;

};
// 监听函数
function eventBind(fn){
	['text', 'image', 'voice', 'video', 'location', 'link', 'subscribe', 'unsubscribe', 'click'].forEach(function(name){
		fn && fn(name);
	});
}
// 监听单个事件
eventBind(function(name){
	WX.prototype[name] = function(fn){
		emitter.on(name, fn);
		return this;
	}
});
// 监听所有信息
WX.prototype.all = function(fn){
	eventBind(function(name){
		emitter.on(name, fn);
	});
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
	// 不传入，默认为 text
	data.msgType = data.msgType || 'text';
	var XML = this.toXML(data);
	this.res.end(XML);
	return this;
}

// 接口
module.exports = function(token){
	return new WX(token);
}