(function(global) {
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (function() {
			return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	}
	/**
	 * Paper Definition
	 * the main painting paper.
	 */
	var PaperSingle = (function() {
		var items = {};
		var ctx = null;
		var canvas = null;

		return {
			run : function() {
				if(!ctx){
					alert('Error, context not set!');
					return;
				}

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for(var k in items){
					items[k].draw(ctx);
				}

				requestAnimationFrame(function(){
					Paper.run();
				});
			},
			addItem : function(key, obj) {
				items[key] = obj;
			},
			removeItem : function(key) {
				delete items[key];
			},
			setCanvas : function(c){
				canvas = c;
				ctx = canvas.getContext('2d');
			}
		}
	}());

	var Paper = function(){
		this.items = {};
		this.canvas = null;
		this.ctx = null;
	}
	Paper.prototype = {
		run: function() {
			var _ = this;
			if (!_.ctx) {
				alert('Error, context not set!');
				return;
			}

			_.ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (var k in _.items) {
				_.items[k].draw(_.ctx);
			}

			requestAnimationFrame(function() {
				_.run();
			});
		},
		addItem: function(key, obj) {
			obj.setContext(this.ctx);
			this.items[key] = obj;
		},
		removeItem: function(key) {
			delete this.items[key];
		},
		setCanvas: function(c) {
			this.canvas = c;
			this.ctx = c.getContext('2d');
		}
	}

	/**
	 * PaperItem Class Definition
	 * All of the things in a canvas should extend this class.
	 */
	var PaperItem = function() {
		this.callbacks = {};
	};
	PaperItem.prototype.draw = function(ctx) {
		
	}
	PaperItem.prototype.setContext = function(ctx) {
		this.context = ctx;
	}
	PaperItem.prototype.when = function(e, callback){
		this.callbacks[e] = callback;
	}
	PaperItem.prototype.trigger = function(e){
		this.callbacks[e] && this.callbacks[e].call(this);
	}
	PaperItem.prototype.off = function(e){
		this.callbacks[e] = null;
	}
	
	global.Paper = Paper;
	global.PaperItem = PaperItem;

}(window));