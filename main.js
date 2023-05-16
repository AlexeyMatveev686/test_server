const express = require('express');
var bodyParser = require('body-parser')
const needle = require('needle');
var cors = require('cors');
const app = express();

app.use(cors({
	origin: '*'
}));
app.use(bodyParser.text());

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
	res.send({ message: 'You should to use post request:)' });
});

app.post('/', (req, res) => {
	
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	let oParsedData = JSON.parse(req.body);

	let method		= oParsedData["method"] || "GET";
	let targetUrl	= oParsedData["target"];
	let data		= oParsedData["data"] || {};
	let options		= {
		"headers": oParsedData["headers"] || {}
	}

	if (!targetUrl) {
		res.end("Bad Request");
		return;
	}

	needle(method, targetUrl, data, options)
		.then((target_response) => {
			console.log(`Status: ${target_response.statusCode}`);
			console.log('Body: ', target_response.body);
			res.statusCode = target_response.statusCode;
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.statusText = JSON.stringify(target_response.body);
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(target_response.body));
		}).catch((err) => {
			res.end("Error of request");
			console.error(err);
	});

});

app.listen(PORT, () => {
	console.log('We are live on ' + PORT);
});