

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
		alert('请使用宽频模式游戏'); // 或者用图片做个假象，让用户主动转屏
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

		var Drawer = (function(){
			var $dom = $('#J_drawer');

			var cbs;

			var closed = true;

			$dom.find('.toggle').on('tap', function(){
				if(closed){
					Drawer.show();
					closed = false;
				}else{
					Drawer.hide();
					closed = true;
				}
			});

			var $btns = $dom.find('.btn');
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

			return {
				show : function(){
					$dom.removeClass('drawer-close');
				},
				config : function(option){
					cbs = option;
				},
				hide : function(){
					$dom.addClass('drawer-close');
				}
			}
		}());

		// Loading.hide();

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
					Loading.show('请求失败');
					return;
				}

				if(data.isCanUsed == 'N'){
					Loading.show('未开启');
					return;
				}

				if(data.isMaxTimes == 'Y'){
					Loading.show('今日游戏次数已达上限');
					return;
				}

				if(data.isWin == 'Y'){
					shoot(duration, 1, true, function(){
						Loading.show('恭喜，球儿进了');
						Drawer.show();
						scoreBoard.setScore(data.credit);
					});
				}else{
					shoot(duration, 0, false, function(){
						Loading.show('对不起，球儿没进');
						Drawer.show();
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
				Drawer.hide();
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
						tmpl += '<div class="item" data-activeid="'+temp.activeId+'">';
						tmpl += ' <h1>'+ temp.preValue +'券</h1>';
						tmpl += ' <h2>'+ temp.credit +'分</h2>';
						tmpl += '</div>';
					}

					Modal.setScorePanel(tmpl);
				});
			},
			onRuleView : function(){
				Modal.show({
					title : '游戏规则'
				});
			},
			onTeamView : function(){
				Modal.show({
					title : '球队选择',
					sel : 'team'
				});
			}
		};
		MainMenu.config(buttonsCb);
		Drawer.config(buttonsCb);

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
			onScoreSelected : function(aid){
				if(confirm('确认兑换？')){
					store.exchangeCoupon({activeId : aid, count : 1}, function(data){
						if(data.isPass != 'Y'){
							Loading.show('请求接收失败');
							return;
						}

						if(data.isMaxTimes == 1){
							Loading.show('达到此券今日兑奖上限');
							return;
						}
						if(data.isMaxTimes == 2){
							Loading.show('达到此券总次数上限');
							return;
						}

						if(data.result != 'Y'){
							Loading.show('兑换失败');
						}else{
							Loading.show('兑换成功');
							Modal.hide();
						}
					});
				}
			}
		});

		function fetchScore(){
			// 获取游戏积分、登录等...
			store.getUserCredit(function(data){
				if(!data.custNum){
					Loading.show('你还没登录');
					return;
				}

				if(data.credit){
					scoreBoard.setScore(data.credit);
				}

				Loading.hide();
			});
		}
		fetchScore();

		
		


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