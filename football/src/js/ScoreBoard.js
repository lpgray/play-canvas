// ScoreBoard Definition
var ScoreBoard = Class.extend(PaperItem, {
	reset: function() {
		var width = 183;
		var height = 75;

		this.width = width * scale;
		this.height = height * scale;
		this.top = canvas.height - this.height;
		this.left = canvas.width - this.width;

		this.context.drawImage(this.img, 0, 0, width, height, this.left, this.top, this.width, this.height);
	},
	draw : function(){
		this.reset();
		this.drawNumber();
	},
	drawNumber : function(){
		var number = this.number || 0;
		var fontSize = 26 * scale;
		var fontTop = 50 * scale;
		var fontLeft = 15 * scale;
		this.context.font = "bold "+ parseInt(fontSize) +"px sans-serif";
		this.context.fillStyle = '#fff';
		this.context.fillText('分数：' + number, this.left + fontLeft, this.top + fontTop);
	},
	setScore : function(number){
		number = number>>0;
		if(number >= 10000){
			number = (number/3000).toFixed(1) + 'k';
		}
		this.number = number;
	}
});