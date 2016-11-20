// Tutorial that we used
// https://github.com/jw84/messenger-bot-tutorial
// hey wassup?

'use strict'
const text_on_image = require('./text_on_image');

const https = require('https');
const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
		extended: false
}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {
		res.send('Hello world, I am a chat bot')
})

app.use(express.static('static'))

// for Facebook verification
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

let USERS = new Object();

// Spin up the server
app.listen(app.get('port'), function() {
		console.log('running on port', app.get('port'))
})


class User {
	// STATES
	// state 0: no input yet
	// state 1: image sent

	constructor(id) {
		this.id = id;
		this.state = 0;
	}

	sentText(text) {
		if (this.state === 0) {
			sendTextMessage(this.id, "Please send an image first");
			return;
		} else if (this.state === 1) {
			this.text = text;
			sendTextMessage(this.id, "Here you go. You input text " + this.text);
			text_on_image(this.inputImageFilename, this.text, this.id);
			sendImage(this.id, "https://salty-reaches-81322.herokuapp.com/images/" + this.id + "-output.png");
			this.state = 0;
			return;
		}
	}

	sentImage(url) {
		this.state = 1;
		this.inputImageFilename = "static/images/" + this.id;
		var file = fs.createWriteStream(this.inputImageFilename);
		var request = https.get(url, function(response) {
			response.pipe(file);
		});
		sendTextMessage(this.id, "Got it. What text do you want to add?");
	}

	// generateImage() {
	// 	// return this.inputImageURL;
	// 	text_on_image();
	// 	return "https://salty-reaches-81322.herokuapp.com/images/biden.jpg";
	// }

}

app.post('/webhook', function(req, res) {
	console.log("recieved webhook");
	var data = req.body;

	// Make sure this is a page subscription
	if (data.object === 'page') {
				
		// Iterate over each entry - there may be multiple if batched
		data.entry.forEach(function(entry) {
			var pageID = entry.id;
			var timeOfEvent = entry.time;

			// Iterate over each messaging event
			entry.messaging.forEach(function(event) {
				let sender = event.sender.id;
				if (event.message) {
					console.log("recieved message from user id " + sender);
					if (!USERS[sender]) {
							USERS[sender] = new User(sender);
					}
					let user = USERS[sender];

					let attachments = event.message.attachments;
					if (attachments) {
							let attachment = attachments[0];
							if (attachment.type === "image") {
									console.log("message type: image");
									user.sentImage(attachment.payload.url);
							} else {
									sendTextMessage(sender, "~~~bad attachment~~~");
							}
					} else if (event.message.text) {
							console.log("text message: '" + event.message.text + "'");
							user.sentText(event.message.text);
					}
				}
			});
		});
	}
	res.sendStatus(200);
})

const token = "EAAKEtMO2qmkBAPoI2EHcoT2BKkAEu8jN0iDzxK9gzX33ZBl7yiTPRVV8qlLlvKguH4euDQZCkfW1w7UkwH07oLZCK15T0g1PlZAJm0nAwaZCixAYHNGIZA8bovpdsyE93fwGFH1QZBkDsGiCHjQWqxtp4O1hxSbb3rggdjLRGt5nwZDZD"

function sendTextMessage(sender, text) {
	let messageData = {
		text: text
	}
	console.log("sending message '" + text + "' to user id " + sender)
	request({
		url: 'https://graph.facebook.com/v2.8/me/messages',
		qs: {
			access_token: token
		},
		method: 'POST',
		json: {
			recipient: {
				id: sender
			},
			message: messageData,
		}
		// error handling
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendImage(sender, imageURL) {
	let messageData = {
		attachment:{
			type: "image",
			payload:{
				url:imageURL
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.8/me/messages',
		qs: {
			access_token: token
		},
		method: 'POST',
		json: {
			recipient: {
				id: sender
			},
			message: messageData,
		}
		// error handling
}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

