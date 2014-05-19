// Draw Course
var Background = Class.extend(PaperItem, {
	draw: function(ctx) {
		ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
	}
});