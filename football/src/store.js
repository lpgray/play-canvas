var store = (function(){

	function date2str(x, y) {
		var z = {
			y: x.getFullYear(),
			M: x.getMonth() + 1,
			d: x.getDate(),
			h: x.getHours(),
			m: x.getMinutes(),
			s: x.getSeconds()
		};
		return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
			return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
		});
	}

	function ajax(option){
		try{
			$.ajax({
				type : 'POST',
				data : option.data,
				url : option.url,
				success : function(data){
					option.success(data);
				},
				error : function(code, text){
					alert(text);
				},
				dataType : 'json',
				cache : false
			})
		}catch(e){
			alert(e);
		}
	}

	function getSign(signObj){
		var back = '';
		for(var k in signObj){
			back += k + '=' + signObj[k] + '&';
		}
		back = back.substring(0, back.length-1);
		return md5(back);
	}

	return {
		// 查询用户个人信息
		getUserCredit : function(custNum, callback){
			ajax({
				url : 'http://sgssit.cnsuning.com/salesgame-web/fkzq/userCredit.htm',
				// url : 'moke/getCredit.json',
				data : {
					custNum : custNum
				},
				success : function(data){
					callback(data);
				}
			});
		},
		// 查询券列表信息
		queryCoupons : function(callback){
			ajax({
				url : 'http://sgssit.cnsuning.com/salesgame-web/fkzq/coupons.htm',
				// url : 'moke/coupons.json',
				success : function(data){
					callback(data);
				}
			});
		},
		// 提交服务器后端获取射门结果
		submitResult : function(params, callback){
			var current = date2str(new Date(), 'yyyyMMddhhmmss');
			var signObj = {
				key : RES.key,
				sourceCode : RES.sourceCode,
				point : params.point,
				time : current
			}

			params.sign = getSign(signObj);
			params.custNum = USR_INFO.custNum;
			params.time = current;
			params.sourceCode = RES.sourceCode;

			ajax({
				url : 'http://sgssit.cnsuning.com/salesgame-web/fkzq/submitResult.htm',
				// url : 'moke/submit.json',
				data : params,
				success : function(data){
					callback(data);
				}
			});
		},
		// 游戏积分兑换券
		exchangeCoupon : function(params, callback){
			var signObj = {
				key : RES.key,
				sourceCode : RES.sourceCode,
				activeId : params.activeId,
				count : params.count
			}

			params.sign = getSign(signObj);
			params.custNum = USR_INFO.custNum;
			params.sourceCode = RES.sourceCode;

			ajax({
				url : 'http://sgssit.cnsuning.com/salesgame-web/fkzq/exchangeCoupon.htm',
				// url : 'moke/exchange.json',
				data : params,
				success : function(data){
					callback(data);
				}
			});
		}
		// ,
		// 检测用户是否已经登录
		// checkLogin : function(callback){
		// 	$.ajax({
		// 		type: 'get',
		// 		url: 'moke/checkLogin.json',
		// 		success: function(data) {
		// 			callback && callback(data);
		// 		},
		// 		error: function(code, text) {
		// 			alert(text);
		// 		},
		// 		dataType: 'json',
		// 		cache : false
		// 	})
		// }
	}
}())