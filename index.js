// Tutorial that we used
// https://github.com/jw84/messenger-bot-tutorial
// hey wassup?

'use strict'

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

// for Facebook verification
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

let USERS = {};

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
			const generatedImage = this.generateImage();
			sendImage(this.id, generatedImage);
			this.state = 0;
			return;
		}
	}

	sentImage(url) {
		this.state = 1;
		this.inputImageURL = url;
		sendTextMessage(this.id, "Got it. What text do you want to add?");
	}

	generateImage() {
		return this.inputImageURL;
	}

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
					console.log("recieved message");
					if (!USERS.sender) {
							USERS.sender = new User(sender);
					}
					let user = USERS.sender;

					let attachments = event.message.attachments;
					if (attachments) {
							let attachment = attachments[0];
							if (attachment.type === "image") {
									user.sentImage(attachment.payload.url);
							} else {
									sendTextMessage(sender, "~~~bad attachment~~~");
							}
					} else if (event.message.text) {
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

