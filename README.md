## wxchat

> 可以使用微信菜单按钮只有2种情况：
> 服务者账号（公司）
> 订阅者账号，需要交300RMB，可以提高权限


## 安装

```
npm install wxchat
```

## 使用

调用及其验证Token，[Token申请地址](https://mp.weixin.qq.com/)

```
var wxchat = require('wxchat')(token);
```

## 调用时处理

```
wxchat.middlewarify(req, res);
```

+ 验证token
+ 处理微信返回xml

## text

```
wxchat.text(function(data){
	var message = {}
	// 发送文本信息后，需要给返回的内容
	wxchat.send(message);
});
```

## image

```
wxchat.image(function(data){
	var message = {}
	// 发送信息后，需要给返回的内容
	wxchat.send(message);
});
```

## voice

```
wxchat.voice(function(data){
	var message = {}
	// 发送信息后，需要给返回的内容
	wxchat.send(message);
});
```

## location

```
wxchat.location(function(data){
	var message = {}
	// 发送信息后，需要给返回的内容
	wxchat.send(message);
});
```

## link

```
wxchat.link(function(data){
	var message = {}
	// 发送信息后，需要给返回的内容
	wxchat.send(message);
});
```

## subscribe

```
wxchat.subscribe(function(data){
	var message = {}
	// 关注时，返回的内容
	wxchat.send(message);
});
```

## unsubscribe

```
wxchat.voice(function(data){
	var message = {}
	// 取消关注时，返回的内容
	wxchat.send(message);
});
```

## click

> 这个比较特殊，需要有菜单时，才可以执行

```
wxchat.click(function(data){
	var message = {}
	// 点击菜单按钮时，返回的内容
	wxchat.send(message);
});
```

## all

> 监听上面所有的事件

## 回复信息

> 必须是JSON

```
wxchat.send(message);
```

## 返回数据类型解释

```
{
	createTime: data.createTime,
	fromUsername: data.fromUsername,
	toUsername: data.toUsername,
	content: '前端分享，欢迎你～'
}
```

createTime/fromUsername/toUsername，是返回的数据中存在的，你也可以手动配置

### content有如下几种类型：

+ 文本

```
{
	title: "标题",
	description: "描述",
	text: 'xxx'
}
```

+ 数组，需要遵守如下的格式

```
{
	title: "标题",
	description: "描述",
	pic: 'http://xxx',
	url: "http://xxx"
}
```

+ music

```
{
	title: "标题",
	description: "描述",
	// 普通质量的音乐
	url: 'http://xxx',
	// 质量比较高的链接（wifi环境优先使用）
	hqUrl: "http://xxx"
}
```

+ voice/image

```
{
	title: "标题",
	description: "描述",
	// 媒体文件的 id
    mediaId: xx
}
```

+ video

```
{
	title: "标题",
	description: "描述",
	// 媒体文件的 id
    mediaId: xx,
    // 视频消息缩略图的id
    thumbMediaId: xx
}
```

## 默认返回的数据

可以通过下面的代码来获取:

```
data.default.xxx
```

### 注意

`data.default.FromUsername` 和 `data.default.ToUsername` 在回复时，请这样填写

```
{
	createTime: data.createTime,
	// 注意下面2项是反的，才是对的
	fromUsername: data.default.ToUsername,
	toUsername: data.default.FromUsername,
	content: '前端分享，欢迎你～'
}
```

## 示例

```
var http = require('http');
var wxchat = require('wxchat')(yourToken);

http.createServer(function (req, res) {
	wxchat.middlewarify(req, res);
	// 关注后，推送欢迎信息
	wxchat.subscribe(function(data){
		var msg = {
			createTime: data.createTime,
			fromUsername: data.fromUsername,
			toUsername: data.toUsername,
			content: '前端分享，欢迎你～'
		}
		wxchat.send(msg);
	});
	// 发来文本信息后，推送一条新闻
	wxchat.text(function(data){
		var msg = {
			msgType: 'news',
			createTime: data.createTime,
			fromUsername : data.fromUsername,
			toUsername : data.toUsername,
			content : [
				{
					title: "sublime自定义",
					description: "多年来，我已经用了很多的代码编辑器，从Windows上的“记事本”到Mac上的Espresso ，TextMate和Sublime Text。最终，一直使用Sublime Text 2，因为它是如此的简单易用，可定制的。",
					url: "http://liuqing.pw/2013/09/12/sublime-customizing-your-workflow.html"
				}
			]
		}
		wxchat.send(msg);
	});

}).listen(process.env.VCAP_APP_PORT || 3000);
```