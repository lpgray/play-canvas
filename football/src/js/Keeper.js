// Goalkeeper Definition
var Goalkeeper = Class.extend(PaperItem, {
	reset: function() {
		var width = 120;
		var height = 166;
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
	changeStatus: function(status) {
		this.status = status;
		this.getBallIdx = 0;
		this.lastActiveTime = 0;
	},
	moveLeft: function() {
		var self = this;

		var clipTop = 0;
		var clipLeft = 121;

		if (this.left > 200 * scale) {
			this.left -= 9;
		} else {
			this.block();
			return;
		}

		this.context.drawImage(this.img, clipLeft * this.moveIdx, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

		if (new Date - this.lastActiveTime >= 60) {
			this.lastActiveTime = new Date;
			this.moveIdx++;
			if (this.moveIdx >= 4) {
				this.moveIdx = 0;
			}
		}
	},
	moveRight: function() {
		var self = this;

		var clipTop = 0;
		var clipLeft = 121;

		if (this.left < 500 * scale) {
			this.left += 9;
		} else {
			this.block();
			return;
		}

		this.context.drawImage(this.img, clipLeft * this.moveIdx, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

		if (new Date - this.lastActiveTime >= 60) {
			this.lastActiveTime = new Date;
			this.moveIdx++;
			if (this.moveIdx >= 4) {
				this.moveIdx = 0;
			}
		}
	},
	block: function() {
		var self = this;

		var clipTop = 167;
		var clipLeft = 121;

		var left = clipLeft * this.blockIdx;

		this.context.drawImage(this.img, left, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

		if (new Date - this.lastActiveTime >= 120) {
			this.lastActiveTime = new Date;
			this.blockIdx++;
			if (this.blockIdx >= 4) {
				this.blockIdx = 0;
			}
		}
	},
	getBall: function() {
		var self = this;

		var clipTop = 167 * 2;
		var clipLeft = 121;

		var left = clipLeft * this.getBallIdx;

		this.context.drawImage(this.img, left, clipTop, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));

		if (new Date - this.lastActiveTime >= 150) {
			this.lastActiveTime = new Date;
			this.getBallIdx++;
			if (this.getBallIdx >= 2) {
				this.getBallIdx = 3;
			}
		}
	},
	stop: function() {
		this.status = 'stop';
		this.context.drawImage(this.img, 121, 167, 120, 166, this.left, this.top, parseInt(120 * scale), parseInt(166 * scale));
	},
	draw: function() {
		this[this.status].call(this);
	}
});