(function() {
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
	var Paper = (function() {
		var items = {};

		return {
			run: function() {
				for(var i = 0, l = items.length; i < l; i++){
					items[i].draw();
				}

				requestAnimationFrame(function(){
					Paper.run();
				}
			},
			addItem: function(key, obj) {
				items[key] = obj;
			},
			removeItem: function(key) {
				delete items[key];
			}
		}
	}());

	/**
	 * PaperItem Class Definition
	 * All of the things in a canvas should extend this class.
	 */
	var PaperItem = function() {
		
	};
	PaperItem.prototype.draw = function() {
		
	};
	
}());