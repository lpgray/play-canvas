var RES = {
	imgs : {
		brazilPlayer : 'img/0002.png',
		argentineanPlayer : 'img/0001.png',
		portuguesePlayer : 'img/0003.png',
		course : 'img/area.jpg',
		keeper : 'img/0004.png',
		ball : 'img/ball.png',
		scoreBoard: 'img/score-board.png'
	},
	imgNumber : 7,
	key : 'abc123',
	sourceCode : 'h5',
	unlogin : function(){
		// 请在这里编写没有登录的回调函数
		// alert('未登录回调');
		goLogon && goLogon.call();
	},
	quitGame : function(){
		// 在这里编写游戏退出函数
		alert('退出游戏回调');
	}
}