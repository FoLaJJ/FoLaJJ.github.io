// 点击显示文字实现方法
! function (e, t, a) {
	// 可自定义的文字序列，后续想扩展只需要往数组里加即可
	var messages = [
		// 原有语句
		"今天看论文没？",
		"黑客别黑我！",
		"欢迎CTFer！",
		"恭喜恭喜！",
		"你的女朋友呢？",
		"代码敲完了吗？",
		"你可以的！",
		"我想要入股纳斯达克！",
		"我想要毕业！",
		"集美们，别偷看！",
		"你是什么成分？",
		"我的法学硕士！",
		"变压器呢？",
		"能给我赞助1元吗？",
		"毕业了我一定要去摆摊炒粉！",
		"家人们谁懂啊？",
		"哈吉米哦南北绿豆！",
		"同学，你上课不认真啊！",
		"你这个需求不太好搞啊",
		"感觉不如原神！",
		"原神，启动！",
		"其实，我知道你在看我！",
		"读研哪有不发疯的！",
		"嘎啦给木里面不是这样的！",
		"难道他真是赋能哥？",
		"颗秒！！",
		"+3",
		"空军老哥",
		"参考文献在哪？",
		"震撼首发！",
		"我希望你永远不要知道Vc的用处！",
		"卧槽，他真的是黑客吗？",
		"我一定要考上深砖！",
		"学网安，这辈子有了",
		"芝士雪豹",
		"我的钱还有用！",
		"有人喜欢钓蟹吗？",
		"emo",
		"曼波，曼波！",
		"哦马吉利曼波"
	];

	// 获取基于时间的问候
	function getTimeGreeting() {
		var hour = new Date().getHours();
		// 00:00 - 05:59 深夜
		if (hour >= 0 && hour < 6) {
			return "🌙 月亮不睡我不睡，我是你的小宝贝！";
		}
		// 06:00 - 10:59 早上
		if (hour >= 6 && hour < 11) {
			return "☀️ 我超，起这么早？";
		}
		// 11:00 - 12:59 中午
		if (hour >= 11 && hour < 13) {
			return "🍚 中午吃什么？";
		}
		// 13:00 - 15:59 下午
		if (hour >= 13 && hour < 16) {
			return "🌞 下午泡壶茶摸摸鱼就过去了";
		}
		// 16:00 - 23:59 晚上 / 夜间
		return "🌃 晚上打把LoLm";
	}

	// ------- 消息选择逻辑优化：避免短时间内频繁重复 -------
	// 维护一个打乱后的消息池，依次取用，用完再重新洗牌
	var messagePool = [];

	function shuffle(arr) {
		for (var i = arr.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}
		return arr;
	}

	function getNextBaseMessage() {
		if (!messagePool.length) {
			// 重新填充并洗牌
			messagePool = shuffle(messages.slice());
		}
		return messagePool.pop();
	}

	// 最终用于展示的一句话：大部分来自基础语句，少部分使用时间问候
	function pickMessage() {
		var useGreeting = Math.random() < 0.05; // 约 5% 概率使用时间问候
		if (useGreeting) {
			return getTimeGreeting();
		}
		return getNextBaseMessage();
	}

	// 生成适中亮度的随机颜色，避免过浅或过深
	function getSoftColor() {
		var min = 0;  // 不要太暗
		var max = 200;  // 不要太亮接近白色
		function rand() {
			return min + Math.floor(Math.random() * (max - min));
		}
		return "rgb(" + rand() + "," + rand() + "," + rand() + ")";
	}

	function r(e) {
		var a = t.createElement("div");
		a.className = "click-text";
		// 随机取一句话（包含时间问候），避免基础语句在一轮中重复
		var msg = pickMessage() || "Hi";

		a.textContent = msg;
		n.push({
			el: a,
			x: e.clientX - 10,
			y: e.clientY - 20,
			scale: 1,
			alpha: 1,
			age: 0, // 帧计数，用于控制何时开始淡出
			color: getSoftColor()
		}), t.body.appendChild(a)
	}

	var n = [];
	e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (e) {
		setTimeout(e, 1e3 / 60)
	},
		function (e) {
			var a = t.createElement("style");
			a.type = "text/css";
			try {
				a.appendChild(t.createTextNode(e))
			} catch (t) {
				a.styleSheet.cssText = e
			}
			t.getElementsByTagName("head")[0].appendChild(a)
		}(
			".click-text{" +
			"position: fixed;" +
			"font-size: 14px;" +
			"font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;" +
			"pointer-events: none;" +
			"user-select: none;" +
			"white-space: nowrap;" +
			"z-index: 99999;" +
			"transition: transform .3s ease-out;" +
			"}"
		),
		function () {
			var t = "function" == typeof e.onclick && e.onclick;
			e.onclick = function (e) {
				t && t(), r(e)
			}
		}(),
		function o() {
			for (var a = 0; a < n.length; a++)
				n[a].alpha <= 0 ? (t.body.removeChild(n[a].el), n.splice(a, 1)) : (
					// 先上浮和缩放
					n[a].y--,
					n[a].scale += .005,
					// 等待约 500ms 再开始淡出（60fps 下约 24 帧）
					n[a].age++,
					(n[a].age > 24 && (n[a].alpha -= .013)),
					n[a].el.style.cssText =
						"left:" + n[a].x + "px;" +
						"top:" + n[a].y + "px;" +
						"opacity:" + n[a].alpha + ";" +
						"transform:scale(" + n[a].scale + "," + n[a].scale + ") translateY(-2px);" +
						"color:" + n[a].color + ";" +
						"z-index:99999;" +
						"position:fixed;" +
						"pointer-events:none;" +
						"white-space:nowrap;"
				);
			requestAnimationFrame(o)
		}()
}(window, document);

document.cookie = "flag=flag{Y0u_f0und_th3_th1rd_f1a9}; path=/";