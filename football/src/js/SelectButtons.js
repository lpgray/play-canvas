var SelectButtons = Class.create({
	init : function() {
		var self = this;
		var top = 60 * scale;
		var left = 215 * scale;
		var width = 123 * scale;
		var height = 47 * scale;
		var arrawWidth = 36 * scale;
		var marginTop = 5 * scale;

		this.buttonsWrap = document.getElementById('J_buttons');
		this.buttonsWrap.style.cssText = 'top : '+ top + 'px; left:' + left + 'px';

		var buttons = this.buttonsWrap.children;
		for(var i = 0, l = buttons.length; i<l ; i++){
			if(buttons[i].className.search('clearfix') > -1){
				continue;
			}
			buttons[i].style.width = width + 'px';
			buttons[i].style.height = height + 'px';
			buttons[i].children[0].style.width = arrawWidth + 'px';
			buttons[i].children[0].style.marginTop = marginTop + 'px';

			buttons[i].addEventListener('touchstart', function(){
				self.touchStartCallback && self.touchStartCallback.call(self);
			}, false);
		}

		this.eventBind();
	},
	hide : function(){
		this.buttonsWrap.style.display = 'none';
	},
	show : function(){
		this.buttonsWrap.style.display = 'block';
	},
	eventBind : function(){
		var self = this;

		this.get('J_btnTL').addEventListener('touchend', function(){
			self.duration = 'TL';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnTT').addEventListener('touchend', function(){
			self.duration = 'TT';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnTR').addEventListener('touchend', function(){
			self.duration = 'TR';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnML').addEventListener('touchend', function(){
			self.duration = 'ML';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnMM').addEventListener('touchend', function(){
			self.duration = 'MM';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnMR').addEventListener('touchend', function(){
			self.duration = 'MR';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnBL').addEventListener('touchend', function(){
			self.duration = 'BL';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnBB').addEventListener('touchend', function(){
			self.duration = 'BB';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);
		this.get('J_btnBR').addEventListener('touchend', function(){
			self.duration = 'BR';
			self.selectedCallback && self.selectedCallback.call(self, self.duration);
		}, false);

	},
	get : function(id){
		return document.getElementById(id);
	},
	onTouchUp : function(callback){
		this.selectedCallback = callback;
	},
	onTouchStart : function(callback){
		this.touchStartCallback = callback;
	}
});