// Ball Definition
var Ball = Class.extend(PaperItem, {
	fly: function(duration, isFocus) {
		var self = this;
		self.getTarget = false;

		this.reset();

		this.duration = duration;
		this.success = isFocus;

		switch (duration) {
			case 'TL':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = -2;
						var verticalTarget = 300;
					} else {
						var k = -1.45;
						var verticalTarget = 420;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
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
				this.calcPath = function(left) {
					if (isFocus) {
						var verticalTarget = 300;
					} else {
						var verticalTarget = 480;
					}

					verticalTarget = verticalTarget * scale;

					topCurrent += topSpeed;

					if (topCurrent >= verticalTarget) {
						topSpeed = 0;
						self.getTarget = true;
					} else {
						self.getTarget = false;
					}

					return topCurrent;
				}
				this.move = 0;
				this.speed = 0;
				break;
			case 'TR':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = 2;
						var verticalTarget = 300;
					} else {
						var k = 1.45;
						var verticalTarget = 420;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
						self.getTarget = false;
					}

					return currentVertical;
				}
				this.move = 0;
				this.speed = 10 * scale;
				break;
			case 'ML':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = -1.5;
						var verticalTarget = 240;
					} else {
						var k = -1.1;
						var verticalTarget = 240;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
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
				this.calcPath = function(left) {
					if (isFocus) {
						var verticalTarget = 220;
					} else {
						var verticalTarget = 220;
					}

					verticalTarget = verticalTarget * scale;

					topCurrent += topSpeed;
					var currentVertical = topCurrent;

					if (currentVertical >= verticalTarget) {
						topSpeed = 0;
						self.getTarget = true;
					} else {
						self.getTarget = false;
					}

					return currentVertical;
				}
				this.move = 0;
				this.speed = 0;
				break;
			case 'MR':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = 1.5;
						var verticalTarget = 250;
					} else {
						var k = 0.9;
						var verticalTarget = 250;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
						self.getTarget = false;
					}

					return currentVertical;
				}
				this.move = 0;
				this.speed = 10 * scale;
				break;
			case 'BL':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = -1.2;
						var verticalTarget = 180;
					} else {
						var k = -0.8;
						var verticalTarget = 180;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
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
				this.calcPath = function(left) {
					if (isFocus) {
						var verticalTarget = 180;
					} else {
						var verticalTarget = 180;
					}

					verticalTarget = verticalTarget * scale;

					topCurrent += topSpeed;
					var currentVertical = topCurrent;

					if (currentVertical >= verticalTarget) {
						topSpeed = 0;
						self.getTarget = true;
					} else {
						self.getTarget = false;
					}

					return currentVertical;
				}
				this.move = 0;
				this.speed = 0;
				break;
			case 'BR':
				this.calcPath = function(left) {
					if (isFocus) {
						var k = 1.1;
						var verticalTarget = 190;
					} else {
						var k = 0.7;
						var verticalTarget = 200;
					}

					verticalTarget = verticalTarget * scale;

					var currentVertical = k * left;

					if (currentVertical >= verticalTarget) {
						self.getTarget = true;
					} else {
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
	reset: function() {
		var ballSize = 52;
		var left = parseInt(400 * scale) - (ballSize / 2);
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
	fall: function() {
		var ballSize = this.ballSize;
		this.context.drawImage(this.img, ballSize, 0, ballSize, ballSize, this.currentLeft, this.currentTop, parseInt(ballSize * scale) * this.scale, parseInt(ballSize * scale) * this.scale);
	},
	disapear: function() {
		var ballSize = this.ballSize;
		this.isHidden = true;
		this.context.drawImage(this.img, -ballSize * 2, -ballSize * 2);
	},
	draw: function() {
		if (this.isHidden) {
			return;
		}

		var ballSize = this.ballSize;
		var left = this.left;
		var top = this.top;

		if (this.getTarget) {
			this.currentLeft = this.left + this.move;
			this.currentTop = this.top - this.calcPath(this.move);
			this.fall();
			// this.trigger('getTarget');
			return;
		}

		if (this.ready) {
			this.move += this.speed;

			left = this.left + this.move;
			top = this.top - this.calcPath(this.move);
			this.currentLeft = left;
			this.currentTop = top;
			this.scale -= 0.01;

			this.context.drawImage(this.img, 0, 0, ballSize, ballSize, left, top, parseInt(ballSize * scale) * this.scale, parseInt(ballSize * scale) * this.scale);
		} else {
			this.context.drawImage(this.img, ballSize, 0, ballSize, ballSize, left, top, parseInt(ballSize * scale), parseInt(ballSize * scale));
		}
	}
});