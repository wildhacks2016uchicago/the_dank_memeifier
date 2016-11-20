// Set up imageMagick
var fs = require('fs'),
	gm = require('gm').subClass({
		imageMagick: true
	});

function resize_picture(original_picture) {
	gm(original_picture)
		.resize(200, 200)
		.write('kittens2.jpg', function(err) {
			if (!err) console.log('Resize Done');
			if (err) console.log('Resize failed');
		});
}

function add_white(resized_picture) {
	var width_white = 50;
	var height_white = 200;

	gm(width_white, height_white, "white")
		.append('kittens2.jpg').append(true)
		.write('kittens3.jpg', function(err) {
			if (!err) console.log('WORKED: Centered our image.\n');
			if (err) console.log('ERROR: Did not center image.\n');
		});
}

function draw_caption(text) {
	var width = 300;
	var height = 100;
	gm(width, height, "white")
		.fontSize(18)
		.font('Helvetica Neue')
		.drawText(20, 20, text)
		.write("writingsomething.jpg", function(err) {
			if (!err) console.log('WORKED: Writing our caption.\n');
			if (err) console.log('ERROR: Caption didnt write.\n');
		});
}

function append_caption_image(actual_image, caption_image) {
	gm(caption_image)
		.append(actual_image)
		.write('final.png', function(err) {
			if (!err) console.log('WORKED: Appending Worked.');
			if (err) console.log('ERROR: Appending not working sry.');
		});
}

function main(original_picture, text) {
	resize_picture(original_picture);
	add_white('kittens2.jpg');
	draw_caption(text);
	append_caption_image('kittens3.jpg', 'writingsomething.jpg');
}

main('therock.jpg', "this is rly dumb");
// main('therock.jpg', "this is rly dumb");
