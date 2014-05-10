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

	// 暴露 canvas
	window.canvas = canvas;
	window.scale = scale;

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
		buttons.onSelected(function(duration){
			var power = pb.stop();
			shoot(duration, 0, true);
		});
		buttons.onTouchStart(function(){
			pb.prepare();
		});

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

		function shoot(duration, focus, success){
			reset();
			player.run();
			buttons.hide();
			setTimeout(function(){
				ball.fly(duration, focus);
				if(success == 1){
					if(duration === 'TT' || duration === 'MM' || duration === 'BB'){
						keeper.changeStatus('moveLeft');
					}
					ball.off('getTarget');
				}else{
					if(duration.indexOf('R') > -1){
						keeper.changeStatus('moveRight');
					}else if(duration.indexOf('L') > -1){
						keeper.changeStatus('moveLeft');
					}
					
					setTimeout(function(){
						ball.disapear();
						keeper.changeStatus('getBall');
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
		}

		reset();

		// TEST CODE
		document.getElementById('J_topLeft').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('TL', 1, isSuccess);
		};
		document.getElementById('J_top').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('TT', 1, isSuccess);
		};
		document.getElementById('J_topRight').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('TR', 1, isSuccess);
		};
		document.getElementById('J_left').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('ML', 1, isSuccess);
		};
		document.getElementById('J_middle').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('MM', 1, isSuccess);
		};
		document.getElementById('J_right').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('MR', 1, isSuccess);
		};
		document.getElementById('J_bottomLeft').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('BL', 1, isSuccess);
		};
		document.getElementById('J_bottom').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('BB', 1, isSuccess);
		};
		document.getElementById('J_bottomRight').onclick = function(){
			var isSuccess = document.getElementById('J_focusIpt').value;
			isSuccess = isSuccess || 0;
			shoot('BR', 1, isSuccess);
		};
		
		document.getElementById('J_stop').onclick = function(){
			keeper.stop();
		};
		document.getElementById('J_block').onclick = function(){
			keeper.changeStatus('block');
		};
		document.getElementById('J_moveLeft').onclick = function(){
			keeper.changeStatus('moveLeft');
		};
		document.getElementById('J_moveRight').onclick = function(){
			keeper.changeStatus('moveRight');
		};
		document.getElementById('J_getBall').onclick = function(){
			keeper.changeStatus('getBall');
		};
		document.getElementById('J_reset').onclick = function(){
			keeper.reset();
		};

		document.getElementById('J_playerReset').onclick = function(){
			player.reset();
		};
		document.getElementById('J_shoot').onclick = function(){
			player.reset();
			player.run();
		};
		document.getElementById('J_b').onclick = function(){
			player.reset('B');
		};
		document.getElementById('J_a').onclick = function(){
			player.reset('A');
		};
		document.getElementById('J_p').onclick = function(){
			player.reset('P');
		};

		document.getElementById('J_allReset').onclick = reset;
	};
};