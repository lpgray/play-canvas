(function(global){
	var Class = {};

	Class.create = function(methods){
		var klass = function(){

		}

		if(methods){
			for(var k in methods){
				klass.prototype[k] = methods[k];
			}
		}

		return klass;
	}

	Class.extend = function(superclass, methods){
		var klass = function(){

		}

		klass.prototype = new superclass;

		if(methods){
			for(var k in methods){
				klass.prototype[k] = methods[k];
			}
		}

		return klass;
	}

	global.Class = Class;
}(window));