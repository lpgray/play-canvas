var ProgressBar = Class.create({
	init : function(){
		var width = parseInt(273 * scale);
		var height = parseInt(40 * scale);
		var left = parseInt(canvas.width/2 - width/2) + canvasLeft;
		var top = parseInt(canvas.height/2 - height/2 + 100 * scale);

		var progressBar = document.getElementById('J_progress');
		var cssText = 'width:' + width + 'px;';
		cssText += 'height:' + height + 'px;';
		cssText += 'top:' + top + 'px;';
		cssText += 'left:' + left + 'px;';
		// cssText += 'display:block';
		progressBar.style.cssText = cssText;

		this.progressBar = progressBar;
		this.bar = progressBar.children[0];
	},
	prepare : function(){
		var self = this;
		this.i = 30;
		this.progressBar.style.display = 'block';
		self.timer = setInterval(function(){
			self.bar.style.width = self.i + '%';
			self.i++;
			if(self.i >= 101){
				self.stop();
			}
		}, 30);
	},
	stop : function(){
		clearInterval(this.timer);
		return this.i;
	},
	hide : function(){
		progressBar.style.display = 'none';
	}
});