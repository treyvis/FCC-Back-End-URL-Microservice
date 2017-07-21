const express = require('express');
const app = express();

const port = 4040;

app.get('/', (req, res) => {
	
});

app.listen(port, () => {
	console.log('Running on ', port);
});