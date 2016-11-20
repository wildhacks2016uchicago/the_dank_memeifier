// Set up imageMagick
var fs = require('fs'),
	gm = require('gm').subClass({
		imageMagick: true
	});

// Set width and height of the caption.
var width = 300;
var height = 100;

// Reference image to call later.
gm('kittens.png')
	.resize(200, 200)
	.write('kittens.jpg', function(err) {
		if (!err) console.log('done');
		if (err) console.log('resize failed');
	});

var width1 = 50;
var height1 = 200;

gm(width1, height1, "white")
	.append('kittens.jpg').append(true)
	.write('kittens.jpg', function(err) {
		if (!err) console.log('WORKED: Centered our image.\n');
		if (err) console.log('ERROR: Did not center image.\n');
	});

// Draw the caption
gm(width, height, "white")
	.fontSize(18)
	.font('Helvetica Neue')
	.drawText(20, 20, "obama: ily joe\nbiden: ily too\nobama: ma vp lmao\nbiden: ayy lmao")
	.write("writingsomething.jpg", function(err) {
		if (!err) console.log('WORKED: Writing our caption.\n');
		if (err) console.log('ERROR: Caption didnt write.\n');
	});

// Append the caption and the image
gm('writingsomething.jpg')
	.append('kittens.jpg')
	.write('crazy.png', function(err) {
		if (!err) console.log('WORKED: Appending Worked.');
		if (err) console.log('ERROR: Appending not working sry.');
	});
