console.log('Starting to Run');

var fs = require('fs'),
	gm = require('gm').subClass({
		imageMagick: true
	});

var width = 500;
var height = 500;

gm(width, height, "white")
	.fontSize(18)
	.font('Helvetica Neue')
	.drawText(width / 10, height / 10, "Andy is c00l\nlol")
	.write("writingsomething.jpg", function(err) {
		if (!err) console.log('yay we did it lol');
		if (err) console.log('fuck this didntt work');
	});
