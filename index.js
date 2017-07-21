const express = require('express');
const mongo = require('mongodb').MongoClient;
const config = require('./config.json');
const app = express();

console.log(config);

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

app.listen(port, () => {
	console.log('Running on ', port);
});