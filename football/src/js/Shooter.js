// Shooter Definition
var Shooter = Class.extend(PaperItem, {
	country: 'B',
	reset: function(country) {
		this.status = 'reset';
		if (country) {
			this.country = country;
		}
		switch (this.country) {
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

		var left = 80;
		var top = 175;

		this.left = left * scale;
		this.top = top * scale;
		this.shotStep = 1;
		this.clipTop = 0;
		this.clipLeft = 2;
		this.lastActiveTime = 0;

		this.context.drawImage(this.img, width * 2, 0, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));
	},
	// run
	run: function(duration) {
		var width = 256;
		var height = 327;

		this.status = 'run';

		this.context.drawImage(this.img, width * this.clipLeft, height * this.clipTop, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));

		if (new Date - this.lastActiveTime >= 150) {
			this.lastActiveTime = new Date;

			this.shotStep++;

			this.left += 10;
			this.top -= 3;

			this.clipLeft++;

			if (this.shotStep === 3) {
				this.clipTop = 1;
				this.clipLeft = 0;
			}

			if (this.shotStep === 7) {
				this.clipLeft = 0;
				this.shoot();
			}
		}
	},
	shoot: function() {
		var width = 256;
		var height = 327;

		this.status = 'shoot';

		this.context.drawImage(this.img, width * this.clipLeft, height * 0, width, height, this.left, this.top, parseInt(width * scale), parseInt(height * scale));

		if (new Date - this.lastActiveTime >= 150) {
			this.lastActiveTime = new Date;

			this.clipLeft++;
			if (this.clipLeft >= 1) {
				this.clipLeft = 1;
			}
		}
	},
	// ball rel
	draw: function() {
		if (this.status === 'run') {
			this.run();
		} else if (this.status === 'shoot') {
			this.shoot();
		} else {
			this.reset();
		}
	},
	setBall: function(ball) {
		this.ball = ball;
	}
});