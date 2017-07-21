const express = require('express');
const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const config = require('./config.json');
const app = express();

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
const idRegex = /^[\d\w]+$/g;

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

app.get('/:data', (req, res) => {
	const data = req.params.data;
	if (urlRegex.test(data)) {
		res.send(data + ' is a valid URL');
	} else if (idRegex.test(data)) {
		mongo.connect(mongoURI, (err, db) => {
			db.collection('urls').find(ObjectId(data)).next((err, doc) => {
				console.log(doc);
			});
		});
		res.send(data + ' is a valid ID');
	} else {
		res.send(data + ' is not a valid URL or ID');
	}
});

app.listen(port, () => {
	console.log('Running on ', port);
});