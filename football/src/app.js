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
	canvas.width = cW;
	canvas.height = cH;

	// Draw Course
	var Course = Class.extend(PaperItem, {
		draw : function(ctx){
			ctx.drawImage(this.img, 0, 0, cW, cH);
		}
	});

	// Shooter Definition
	var Shooter = Class.extend(PaperItem, {
		country : 'B',
		reset : function(country){
			this.status = 'reset';
			if(country){
				this.country = country;
			}
			switch(this.country){
				case 'B':
				this.img = resourse['brazilPlayer'];
				break;
				case 'A':
				this.img = resourse['argentineanPlayer'];
				break;
				case 'P':
				this.img = resourse['portuguesePlayer'];
				break;
			}

			var width = 256;
			var height = 327;

			var left = 100;
			var top = 166;

			this.left = left * scale;
			this.top = top * scale;
			this.shotStep = 1;
			this.clipTop = 0;
			this.clipLeft = 2;
			this.lastActiveTime = 0;

			this.context.drawImage(this.img, width * 2, 0, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));
		},
		// run
		run : function(duration){
			var width = 256;
			var height = 327;

			this.status = 'run';

			this.context.drawImage(this.img, width * this.clipLeft, height * this.clipTop, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));
		
			if(new Date - this.lastActiveTime >= 150){
				this.lastActiveTime = new Date;
				
				this.shotStep++;
				
				this.left += 10;
				this.top -= 3;
				
				this.clipLeft++;

				if(this.shotStep === 3){
					this.clipTop = 1;
					this.clipLeft = 0;
				}

				if(this.shotStep === 7){
					this.clipLeft = 0;
					this.shoot();
				}
			}
		},
		shoot : function(){
			var width = 256;
			var height = 327;

			this.status = 'shoot';

			this.context.drawImage(this.img, width * this.clipLeft, height * 0, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));
			
			if(new Date - this.lastActiveTime >= 150){
				this.lastActiveTime = new Date;

				this.clipLeft++;
				if(this.clipLeft >= 1){
					this.clipLeft = 1;
				}
			}
		},
		// ball rel
		draw : function(){
			if(this.status === 'run'){
				this.run();
			}else if(this.status === 'shoot'){
				this.shoot();
			}else{
				this.reset();
			}
		},
		setBall : function(ball){
			this.ball = ball;
		}
	});

	// Goalkeeper Definition
	var Goalkeeper = Class.extend(PaperItem, {
		reset : function(){
			var width = 120;
			var height= 166;
			var left = parseInt(400 * scale) - (width * scale / 2);
			var top = parseInt(80 * scale);
			this.status = 'reset';
			this.left = left;
			this.top = top;
			this.clipTop = 167;
			this.clipLeft = 121;

			this.lastActiveTime = 0;
			this.blockIdx = 0;
			this.moveIdx = 0;
			this.getBallIdx = 0;
			
			this.context.drawImage(this.img, 0, height + 1, width, height, left, top, parseInt(width * scale), parseInt(height * scale));
		},
		changeStatus : function(status){
			this.status = status;
			this.getBallIdx = 0;
			this.lastActiveTime = 0;
		},
		moveLeft : function(){
			var self = this;

			var clipTop = 0;
			var clipLeft = 121;
			
			if(this.left > 200 * scale){
				this.left-=9;
			}else{
				this.block();
				return;
			}

			this.context.drawImage(this.img, clipLeft * this.moveIdx, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

			if(new Date - this.lastActiveTime >= 60){
				this.lastActiveTime = new Date;
				this.moveIdx++;
				if(this.moveIdx>=4){
					this.moveIdx = 0;
				}
			}
		},
		moveRight : function(){
			var self = this;

			var clipTop = 0;
			var clipLeft = 121;
			
			if(this.left < 500 * scale){
				this.left+=9;
			}else{
				this.block();
				return;
			}

			this.context.drawImage(this.img, clipLeft * this.moveIdx, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

			if(new Date - this.lastActiveTime >= 60){
				this.lastActiveTime = new Date;
				this.moveIdx++;
				if(this.moveIdx>=4){
					this.moveIdx = 0;
				}
			}
		},
		block : function(){
			var self = this;

			var clipTop = 167;
			var clipLeft = 121;

			var left = clipLeft * this.blockIdx;

			this.context.drawImage(this.img, left, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

			if(new Date - this.lastActiveTime >= 120){
				this.lastActiveTime = new Date;
				this.blockIdx++;
				if(this.blockIdx>=4){
					this.blockIdx = 0;
				}
			}
		},
		getBall : function(){
			var self = this;

			var clipTop = 167*2;
			var clipLeft = 121;

			var left = clipLeft * this.getBallIdx;

			this.context.drawImage(this.img, left, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

			if(new Date - this.lastActiveTime >= 150){
				this.lastActiveTime = new Date;
				this.getBallIdx++;
				if(this.getBallIdx >= 2){
					this.getBallIdx = 3;
				}
			}
		},
		stop : function(){
			this.status = 'stop';
			this.context.drawImage(this.img, 121, 167, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));
		},
		draw : function(){
			this[this.status].call(this);
		}
	});

	// Ball Definition
	var Ball = Class.extend(PaperItem, {
		fly : function(duration, isFocus){
			var self = this;
			self.getTarget = false;
			
			this.reset();
			
			this.duration = duration;
			this.success = isFocus;

			switch (duration){
				case 'TL':
					this.calcPath = function(left){
						if(isFocus){
							var k = -2;
							var verticalTarget = 300;
						}else{
							var k = -1.45;
							var verticalTarget = 420;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = -10 * scale;
					break;
				case 'TT':
					var topSpeed = 12;
					var topCurrent = 0;
					this.calcPath = function(left){
						if(isFocus){
							var verticalTarget = 300;
						}else{
							var verticalTarget = 480;
						}

						verticalTarget = verticalTarget * scale;

						topCurrent += topSpeed;

						if(topCurrent >= verticalTarget){
							topSpeed = 0;
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return topCurrent;
					}
					this.move = 0;
					this.speed = 0;
					break;
				case 'TR':
					this.calcPath = function(left){
						if(isFocus){
							var k = 2;
							var verticalTarget = 300;
						}else{
							var k = 1.45;
							var verticalTarget = 420;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = 10 * scale;
					break;
				case 'ML':
					this.calcPath = function(left){
						if(isFocus){
							var k = -1.5;
							var verticalTarget = 240;
						}else{
							var k = -1.1;
							var verticalTarget = 240;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = -10 * scale;
					break;
				case 'MM':
					var topSpeed = 12;
					var topCurrent = 0;
					this.calcPath = function(left){
						if(isFocus){
							var verticalTarget = 220;
						}else{
							var verticalTarget = 220;
						}

						verticalTarget = verticalTarget * scale;

						topCurrent += topSpeed;
						var currentVertical = topCurrent;

						if(currentVertical >= verticalTarget){
							topSpeed = 0;
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = 0;
					break;
				case 'MR':
					this.calcPath = function(left){
						if(isFocus){
							var k = 1.5;
							var verticalTarget = 250;
						}else{
							var k = 0.9;
							var verticalTarget = 250;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = 10 * scale;
					break;
				case 'BL':
					this.calcPath = function(left){
						if(isFocus){
							var k = -1.2;
							var verticalTarget = 180;
						}else{
							var k = -0.8;
							var verticalTarget = 180;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = -10 * scale;
					break;
				case 'BB':
					var topSpeed = 12;
					var topCurrent = 0;
					this.calcPath = function(left){
						if(isFocus){
							var verticalTarget = 180;
						}else{
							var verticalTarget = 180;
						}

						verticalTarget = verticalTarget * scale;

						topCurrent += topSpeed;
						var currentVertical = topCurrent;

						if(currentVertical >= verticalTarget){
							topSpeed = 0;
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = 0;
					break;
				case 'BR':
					this.calcPath = function(left){
						if(isFocus){
							var k = 1.1;
							var verticalTarget = 190;
						}else{
							var k = 0.7;
							var verticalTarget = 200;
						}

						verticalTarget = verticalTarget * scale;

						var currentVertical = k * left;

						if(currentVertical >= verticalTarget){
							self.getTarget = true;
						}else{
							self.getTarget = false;
						}

						return currentVertical;
					}
					this.move = 0;
					this.speed = 10 * scale;
					break;
			}
			this.ready = true;
		},
		reset : function(){
			var ballSize = 52;
			var left = parseInt(400 * scale) - (ballSize/2);
			var top = parseInt(360 * scale);
			
			this.ballSize = ballSize;
			this.left = left;
			this.top = top;

			this.move = 0;
			this.scale = 1;
			this.rotate = 0;
			this.ready = false;
			this.getTarget = false;
			this.isHidden = false;
			this.context.drawImage(this.img, ballSize, 0, ballSize, ballSize, left, top, parseInt(ballSize * scale), parseInt(ballSize * scale));
		},
		fall : function(){
			var ballSize = this.ballSize;
			this.context.drawImage(this.img, ballSize, 0, ballSize, ballSize, this.currentLeft, this.currentTop, parseInt(ballSize * scale) * this.scale, parseInt(ballSize * scale) * this.scale);
		},
		disapear : function(){
			var ballSize = this.ballSize;
			this.isHidden = true;
			this.context.drawImage(this.img, -ballSize * 2, -ballSize * 2);
		},
		draw : function(){
			if(this.isHidden){
				return;
			}

			var ballSize = this.ballSize;
			var left = this.left;
			var top = this.top;

			if(this.getTarget){
				this.currentLeft = this.left + this.move;
				this.currentTop = this.top - this.calcPath(this.move);
				this.fall();
				// this.trigger('getTarget');
				return;
			}

			if(this.ready){
				this.move += this.speed;

				left = this.left + this.move;
				top = this.top - this.calcPath(this.move);
				this.currentLeft = left;
				this.currentTop = top;
				this.scale -= 0.01;

				this.context.drawImage(this.img, 0, 0, ballSize, ballSize, left, top, parseInt(ballSize * scale) * this.scale, parseInt(ballSize * scale) * this.scale);
			}else{
				this.context.drawImage(this.img, ballSize, 0, ballSize, ballSize, left, top, parseInt(ballSize * scale), parseInt(ballSize * scale));
			}
		}
	});

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
		
		// Paper
		Paper.setCanvas(canvas);
		Paper.addItem('course', course);
		Paper.addItem('keeper', keeper);
		Paper.addItem('ball', ball);
		Paper.addItem('player', player);
		Paper.run();

		function shoot(duration, focus, success){
			reset();
			player.run();
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
					// ball.when('getTarget', function(){
					// 	// ball.disapear();
					// 	keeper.changeStatus('getBall');
					// });
					setTimeout(function(){
						ball.disapear();
						keeper.changeStatus('getBall');
					}, 200);
				}
			}, 150*6);
		}

		function reset(){
			player.reset();
			ball.reset();
			keeper.reset();
			keeper.changeStatus('block');
		}

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

	var loadedNumber = 0;
	var imagesNumber = 6;
	var imgLoad = function(key){
		// console.info(key + ' loaded.');
		loadedNumber++;
		if(loadedNumber === imagesNumber){
			appInit.call();
		}
	};

	// Image Res
	var resourse = {};
	for(var key in RES.imgs){
		resourse[key] = new Image();
		resourse[key].onload = (function(k){
			return function(){
				imgLoad.call(this, k + ' image');
			}
		}(key))
		resourse[key].src = RES.imgs[key];
	}
};