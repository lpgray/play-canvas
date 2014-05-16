
window.onload = function(){
	
	// alert(navigator.userAgent);
	// Canvas Context
	var canvas = document.getElementById('J_canvas');
	var scale = 1; // other image to scale by the number
	var resource = {}; // image resource

	// set canvas size
	var wH = window.innerHeight;
	var wW = window.innerWidth;
	if(wW < wH){
		alert('请使用宽频模式进行游戏，请旋转屏幕');
		location.reload();
		return;
	}

	if(wW > 800){
		var cW = 800;
	}else{
		var cW = wW;
		scale = cW / 800;
	}

	var cH = cW * 0.6;

	if(cH > wH){
		cH = wH;
		cW = cH / 0.6;
		scale = cW / 800;
	}

	var canvasLeft = 0;
	if(cW < wW){
		canvasLeft = parseInt((wW - cW)/2);
		canvas.style.marginLeft = canvasLeft + 'px';
	}
	window.canvasLeft = canvasLeft;

	canvas.width = cW;
	canvas.height = cH;

	// 暴露 canvas和缩放值
	window.canvas = canvas;
	window.scale = scale;

	// 缩放
	$('.j_will_scale,.j_will_scale_full').css({
		'-webkit-transform' : 'scale('+ scale +')',
		'-moz-transform' : 'scale('+ scale +')',
		'-ms-transform' : 'scale('+ scale +')',
		'-o-transform' : 'scale('+ scale +')'
	});
	
	Loading.show('正在加载游戏...');

	var loadedNumber = 0;
	var imagesNumber = RES.imgNumber;
	var imgLoad = function(key){
		// console.info(key + ' loaded.');
		loadedNumber++;
		if(loadedNumber === imagesNumber){
			appInit.call();
		}
	};

	// Image Res
	var resourse = {};
	// 暴露 resourse
	window.resourse = resourse;
	for(var key in RES.imgs){
		resourse[key] = new Image();
		resourse[key].onload = (function(k){
			return function(){
				imgLoad.call(this, k + ' image');
			}
		}(key))
		resourse[key].src = RES.imgs[key];
	}

	// App Init
	var appInit = function(){
		// console.info('App init calling...', resourse);
		var context = canvas.getContext('2d');

		// Init Course
		var course = new Course();
		course.img = resourse['course'];
		course.draw(context);

		// Init Player
		var player = new Shooter();
		player.setContext(context);
		player.reset();

		// Init Ball
		var ball = new Ball();
		ball.img = resourse['ball'];
		ball.setContext(context);
		ball.reset();

		// Init Goalkeeper
		var keeper = new Goalkeeper();
		keeper.img = resourse['keeper'];
		keeper.setContext(context);
		keeper.reset();

		// Init ScoreBoard
		var scoreBoard = new ScoreBoard();
		scoreBoard.setContext(context);
		scoreBoard.img = resourse['scoreBoard'];

		// Init Buttons
		var buttons = new SelectButtons();
		buttons.init();

		// Init ProgressBar
		var pb = new ProgressBar();
		pb.init();

		// Paper
		Paper.setCanvas(canvas);
		Paper.addItem('course', course);
		Paper.addItem('keeper', keeper);
		Paper.addItem('ball', ball);
		Paper.addItem('player', player);
		Paper.addItem('scoreBoard', scoreBoard);
		Paper.run();

		var timer, timer1;
		function shoot(duration, focus, success, callback){
			reset();
			player.run();
			buttons.hide();
			setTimeout(function(){
				ball.fly(duration, focus);
				if(success){
					if(duration === 'TT' || duration === 'MM' || duration === 'BB'){
						keeper.changeStatus('moveLeft');
					}
					clearTimeout(timer1);
					timer1 = setTimeout(function() {
						callback && callback.call();
					}, 450);
				}else{
					if(duration.indexOf('R') > -1){
						keeper.changeStatus('moveRight');
					}else if(duration.indexOf('L') > -1){
						keeper.changeStatus('moveLeft');
					}
					clearTimeout(timer);
					clearTimeout(timer1);
					timer = setTimeout(function(){
						ball.disapear();
						keeper.changeStatus('getBall');
						timer1 = setTimeout(function(){
							callback && callback.call();
						}, 200);
					}, 250);
				}
			}, 150*6);
		}

		function reset(){
			player.reset();
			ball.reset();
			keeper.reset();
			buttons.show();
			keeper.changeStatus('block');
			Loading.hide();
			pb.hide();
		}

		var MainMenu = (function(){
			var $dom = $('#J_mainPanel');

			var cbs;

			var $btns = $dom.find('.btn-primary');
			$($btns[0]).bind('tap', function(){
				cbs['onStart'] && cbs['onStart'].call();
				return false;
			});
			$($btns[1]).bind('tap', function(){
				cbs['onTeamView'] && cbs['onTeamView'].call();
				return false;
			});
			$($btns[2]).bind('tap', function(){
				cbs['onRuleView'] && cbs['onRuleView'].call();
				return false;
			});
			$($btns[3]).bind('tap', function(){
				cbs['onScoreView'] && cbs['onScoreView'].call();
				return false;
			});

			var $btnMinis = $dom.find('.btn-mini');

			$($btnMinis[0]).bind('tap', function(){
				cbs['onMineView'] && cbs['onQuitView'].call();
				return false;
			});
			$($btnMinis[2]).bind('tap', function(){
				cbs['onShareView'] && cbs['onShareView'].call();
				return false;
			});

			var $topPanelBtns = $('#J_toppanel').find('.btn-mini');
			$($topPanelBtns[0]).bind('tap', function(){
				MainMenu.show();
				return false;
			});
			$($topPanelBtns[2]).bind('tap', function(){
				cbs['onShareView'] && cbs['onShareView'].call();
				return false;
			});

			return {
				show : function(){
					$dom.css('display', 'block');
				},
				config : function(option){
					cbs = option;
				},
				hide : function(){
					$dom.css('display', 'none');
				}
			}
		}());


		buttons.onTouchStart(function(){
			pb.prepare();
		});
		
		// 点击按钮蓄力抬起事件
		buttons.onTouchUp(function(duration){
			var power = pb.stop();
				
			var params = {
				type : 1
			}

			if(duration.indexOf('L') > -1){
				params.point = 'A';
			}else if(duration.indexOf('R') > -1){
				params.point = 'C';
			}else{
				params.point = 'B';
			}

			// 提交服务器获得射门结果
			store.submitResult(params, function(data){
				
				if(data.isPass == 'N'){
					Loading.show('系统异常，请检查网络或稍后重试！');
					return;
				}

				if(data.isCanUsed == 'N'){
					Loading.show('活动未开启');
					return;
				}

				if(data.isMaxTimes == 'Y'){
					Loading.show('您当天的游戏次数已用完');
					return;
				}

				if(data.isWin == 'Y'){
					shoot(duration, 1, true, function(){
						Loading.show('进球了，获得 '+data.addCredit+' 积分', reset);
						// Drawer.show();
						scoreBoard.setScore(data.credit);
					});
				}else{
					shoot(duration, 0, false, function(){
						Loading.show('没关系，继续努力', reset);
						// Drawer.show();
						scoreBoard.setScore(data.credit);
					});
				}
			});
		});
		
		MainMenu.show();
		//点击按钮事件回调
		var buttonsCb = {
			onStart : function(){
				MainMenu.hide();
				reset();
			},
			onScoreView : function(){
				Modal.show({
					title : '积分兑换',
					sel : 'score'
				});

				store.queryCoupons(function(data){
					var tmpl = '';
					for(var i = 0, l = data.couponList.length; i < l ;i++){
						var temp = data.couponList[i];
						tmpl += '<div class="item" data-activeid="'+temp.activeId+'" data-value="'+temp.preValue+'" data-purchase="'+temp.credit+'">';
						tmpl += ' <h2>'+temp.credit+'积分</h2>';
						tmpl += ' <img src="img/coupon_'+temp.preValue+'.png" alt="'+temp.preValue+'元券" />';
						// tmpl += ' <h2>'+ temp.preValue +'元券</h2>';
						tmpl += '</div>';
					}

					Modal.setScorePanel(tmpl);
				});
			},
			onRuleView : function(){
				Modal.show({
					title : '游戏规则',
					sel : 'words'
				});
			},
			onTeamView : function(){
				Modal.show({
					title : '球队选择',
					sel : 'team'
				});
			},
			onShareView : function(){
				Modal.show({
					title : '分享游戏',
					sel : 'share'
				});
			},
			onMineView : function(){
				Modal.show({
					title : '我的战绩',
					sel : 'mine'
				});
			},
			onQuitView : function(){
				if(confirm('退出游戏？')){
					RES.quitGame();
				}
			}
		};
		MainMenu.config(buttonsCb);

		Modal.config({
			onTeamSelected : function(idx){
				if(idx == 0){
					player.reset('B');
				}else if(idx == 1){
					player.reset('A');
				}else{
					player.reset('P');
				}
			},
			onScoreSelected : function(option){
				if(confirm('你确定要兑换'+ option.value +'元现金券吗？')){

					// 与我的当前积分判断
					var score = scoreBoard.getScore();
					if(score <= option.credit){
						Loading.show('你没有那么多积分哦，快去踢球赚积分吧。');
						return;
					}

					store.exchangeCoupon({activeId : option.aid, count : 1}, function(data){
						if(data.isPass != 'Y'){
							Loading.show('系统异常，请检查网络或稍后重试！');
							return;
						}

						if(data.isMaxTimes == 1){
							Loading.show('你已经不能再换这张卷了,换其他的卷试试吧.');
							return;
						}
						if(data.isMaxTimes == 2){
							Loading.show('这张卷已经发完了,换其他的卷试试吧.');
							return;
						}

						if(data.result != 'Y'){
							Loading.show('兑换失败，请刷新页面后重新打开。');
						}else{
							Loading.show('<p style="font-size: .8em; margin: 0; padding: 0">恭喜你获得了一张'+option.value+'元现金卷，你可以前往【我的易购】中的【我的现金卷】中查询。</p>');
							Modal.hide();
							fetchScore();
						}
					});
				}
			}
		});

		function fetchLogin(){
			// 获取游戏积分、登录等...
			store.getUserCredit(function(data){
				if(!data.custNum){
					Loading.show('你还没登录');
					RES.unlogin();
					return;
				}

				if(data.credit){
					scoreBoard.setScore(data.credit);
				}

				Loading.hide();
			});
		}
		fetchLogin();

		function fetchScore(){
			store.getUserCredit(function(data){
				if(!data.custNum){
					Loading.show('你还没登录');
					RES.unlogin();
					return;
				}

				if(data.credit){
					scoreBoard.setScore(data.credit);
				}
			});
		}

		
		


		// reset();

		// TEST CODE
		// document.getElementById('J_topLeft').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('TL', 1, isSuccess);
		// };
		// document.getElementById('J_top').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('TT', 1, isSuccess);
		// };
		// document.getElementById('J_topRight').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('TR', 1, isSuccess);
		// };
		// document.getElementById('J_left').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('ML', 1, isSuccess);
		// };
		// document.getElementById('J_middle').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('MM', 1, isSuccess);
		// };
		// document.getElementById('J_right').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('MR', 1, isSuccess);
		// };
		// document.getElementById('J_bottomLeft').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('BL', 1, isSuccess);
		// };
		// document.getElementById('J_bottom').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('BB', 1, isSuccess);
		// };
		// document.getElementById('J_bottomRight').onclick = function(){
		// 	var isSuccess = document.getElementById('J_focusIpt').value;
		// 	isSuccess = isSuccess || 0;
		// 	shoot('BR', 1, isSuccess);
		// };
		
		// document.getElementById('J_stop').onclick = function(){
		// 	keeper.stop();
		// };
		// document.getElementById('J_block').onclick = function(){
		// 	keeper.changeStatus('block');
		// };
		// document.getElementById('J_moveLeft').onclick = function(){
		// 	keeper.changeStatus('moveLeft');
		// };
		// document.getElementById('J_moveRight').onclick = function(){
		// 	keeper.changeStatus('moveRight');
		// };
		// document.getElementById('J_getBall').onclick = function(){
		// 	keeper.changeStatus('getBall');
		// };
		// document.getElementById('J_reset').onclick = function(){
		// 	keeper.reset();
		// };

		// document.getElementById('J_playerReset').onclick = function(){
		// 	player.reset();
		// };
		// document.getElementById('J_shoot').onclick = function(){
		// 	player.reset();
		// 	player.run();
		// };
		// document.getElementById('J_b').onclick = function(){
		// 	player.reset('B');
		// };
		// document.getElementById('J_a').onclick = function(){
		// 	player.reset('A');
		// };
		// document.getElementById('J_p').onclick = function(){
		// 	player.reset('P');
		// };

		// document.getElementById('J_allReset').onclick = reset;
	};
};