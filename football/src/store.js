var store = (function(){
	var storage = {};

	return {
		// 查询用户个人信息，一般为登录授权使用
		queryUserInfo : function(callback){

		},
		// 查询我的战绩
		queryMyRecord : function(callback){

		},
		// 查询游戏规则
		queryGameRule : function(callback){

		},
		// 提交服务器后端获取射门结果
		getGameResult : function(params, callback){
			callback.call(params);
		}
	}
}())