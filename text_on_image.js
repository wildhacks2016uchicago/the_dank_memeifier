// Set up imageMagick
var Promise = require("bluebird");

var fs = require('fs');
var gm = require('gm').subClass({
	imageMagick: true
});

function text_on_image(original_picture, text, userid) {
	var resize_promise = new Promise(function(resolve, reject) {
		gm(original_picture)
			.resize(200, 200)
			.write('static/images/' + userid + '-temp2.jpg', function(err) {
				if (!err) {
					resolve("Resize Stuff worked!");
					console.log('Resize Done');
				}
				if (err) {
					reject(Error("Resize didn't happen"));
					console.log('Resize failed');
				}
			});
	});
	var add_white_promise = resize_promise.then(function(resolve, reject) {
		return new Promise(function(resolve, reject) {
			var width_white = 50;
			var height_white = 200;
			gm(width_white, height_white, "white")
				.append('static/images/' + userid + '-temp2.jpg').append(true)
				.write('static/images/' + userid + '-temp3.jpg'), function(err) {
					if (!err) {
						resolve("Add White Stuff Worked!");
						console.log('WORKED: Centered our image.\n');
					}
					if (err) {
						reject(Error("Add white didn't happen"));
						console.log('ERROR: Did not center image.\n');
					}
				});
		})
	});
	var draw_caption_promise = add_white_promise.then(function(resolve, reject) {
		return new Promise(function(resolve, reject) {
			var width = 300;
			var height = 100;
			gm(width, height, "white")
				.fontSize(18)
				.font('Helvetica Neue')
				.drawText(20, 20, text)
				.write('static/images/' + userid + '-temp4.jpg', function(err) {
					if (!err) {
						resolve("Draw caption worked!");
						console.log('WORKED: Writing our caption.\n');
					}
					if (err) {
						reject(Error("Add white didn't happen"));
						console.log('ERROR: Caption didnt write.\n');
					}
				});
		})
	});
	var append_caption_image = draw_caption_promise.then(function(resolve, reject) {
		return new Promise(function(resolve, reject) {
			gm('static/images/' + userid + '-temp4.jpg')
				.append('static/images/' + userid + '-temp3.jpg')
				.write('static/images/' + userid + '-output.png', function(err) {
					if (!err) {
						resolve("Append caption worked!");
						console.log('WORKED: Appending Worked.');
					}
					if (err) {
						reject(Error("append caption didnt work lmao"));
						console.log('ERROR: Appending not working sry.');
					}
				});
		})
	});
	return append_caption_image.then(function(resolve, reject) {
		return resize_promise.value() + add_white_promise.value() + draw_caption_promise.value() + append_caption_image.value();
	});
}

module.exports = text_on_image;

// main('therock.jpg', "this is rly dumb");

//
// 	resize_picture(original_picture);
// 	add_white('kittens2.jpg');
// 	draw_caption(text);
// 	append_caption_image('kittens3.jpg', 'writingsomething.jpg');
// }
//
// main('therock.jpg', "this is rly dumb");
// // main('therock.jpg', "this is rly dumb");
