const express = require('express');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const config = require('./config.json');
const app = express();

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
const idRegex = /^[\d\w]+$/g;
const httpRegex = /http(s)?:\/\//g;

const port = 4040;
const mongoURI = 'mongodb://' + config.user + ':' + config.password + '@ds121091.mlab.com:21091/url-shorten-microservice';

app.get('/', (req, res) => {
	mongo.connect(mongoURI, (err, db) => {
		if (err) throw err;
		console.log('Connected to db');
		db.collection('urls')
			.find().toArray((err, docs) => {
				if (err) throw err;
				console.log(docs);
				res.send(docs);
			});
	});
});

app.get('/*?', (req, res) => {
	const data = req.params[0];
	console.log('Passed data:',data);
	if (urlRegex.test(data)) {
		let doc;
		if (httpRegex.test(data)){
			doc = {"url": data};
		} else {
			doc = {"url": "https://" + data};
		}
		mongo.connect(mongoURI, (err, db) => {
			db.collection('urls').insert(doc, (err,doc) => {
				if (err) throw err;
				console.log('Generated URL:','https://fcc-urlmicroservice.glitch.me/' + doc.insertedIds[0]);
				const addedRes = {"url":'https://fcc-urlmicroservice.glitch.me/' + doc.insertedIds[0]};
				res.json(addedRes);
			});
		});
	} else if (idRegex.test(data)) {
		mongo.connect(mongoURI, (err, db) => {
			db.collection('urls').find(ObjectId(data)).next((err, doc) => {
				console.log('Redirect: ', doc.url);
				res.redirect(doc.url);
			});
		});
	} else {
		const error = {"error":"Invalid URL"};
		res.json(error);
	}
});

app.listen(port, () => {
	console.log('Running on ', port);
});