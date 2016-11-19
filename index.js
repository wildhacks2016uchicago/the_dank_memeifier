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

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message) {
			let attachment = event.message.attachments[0];
			if (attachment) {
				if (attachment.type === "image") {
					sendTextMessage(sender, "you sent an image");
					sendImage(sender, attachment.payload.url);
				} else {
					sendTextMessage(sender, "~~~bad attachment~~~");
				}
			} 
			if (event.message.text) {
				let text = event.message.text;
				sendTextMessage(sender, "Hey! you said: " + text.substring(0, 200));
			}
		}
	}
	res.sendStatus(200)
})

const token = "EAAKEtMO2qmkBAPoI2EHcoT2BKkAEu8jN0iDzxK9gzX33ZBl7yiTPRVV8qlLlvKguH4euDQZCkfW1w7UkwH07oLZCK15T0g1PlZAJm0nAwaZCixAYHNGIZA8bovpdsyE93fwGFH1QZBkDsGiCHjQWqxtp4O1hxSbb3rggdjLRGt5nwZDZD"

function sendTextMessage(sender, text) {
	let messageData = {
		text: text
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
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
		url: 'https://graph.facebook.com/v2.6/me/messages',
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
