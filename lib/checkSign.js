var crypto = require('crypto');
var querystring = require('querystring');
var url = require('url');
/**
 * 验证token
 * @param query
 * @param token
 * @returns {boolean}
 */
module.exports = function(token, req, res){
	var query = querystring.parse(url.parse(req.url).query);
	var sign = query.signature,
		stamp = query.timestamp,
		nonce = query.nonce,
		echostr = query.echostr

	var arr = [token, stamp, nonce].sort();

	var sha1 = crypto.createHash('sha1');
	sha1.update(arr.join(''));

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end((sha1.digest('hex') === sign) ? echostr : '');
	return res;
}