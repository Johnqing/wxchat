var urllib = require('urllib');
/**
 * 公共处理函数
 * @param fn
 * @returns {Function}
 */
function handle(fn){
	var self = this;
	return function(err, data, res){
		if(err){
			console.log(err);
			return fn && fn(err, data);
		}
		self.accessToken = data.access_token;
		var time = new Date().getTime();
		self.expireTime = time + (data.expires_in - 10) * 1000;
		fn && fn.call(self, data, res);
	}
}

module.exports = {
	OAuth: function(opts){
		this.appid = opts.appid;
		this.appsecret = opts.appsecret;
	},
	/**
	 * 根据 appid/secret 获取accessToken
	 * @param fn
	 */
	getAccessToken: function(fn){
		var self = this;
		var url = 'https://api.weixin.qq.com/cgi-bin/token';
		var info = {
			appid: this.appid,
			secret: this.appsecret,
			grant_type: 'client_credential'
		}

		urllib.request(url, {
			data: info,
			dataType: 'json'
		}, handle.call(self, fn));
	}
}