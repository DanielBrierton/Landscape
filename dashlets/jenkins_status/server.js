var http = require('http'),
	https = require('https');

module.exports = function (dashlet) {

	dashlet.rest('/:host/:job/:proto?', function (req, res) {
		var job = req.params.job;
		var host = req.params.host;
		var proto = req.params.proto || 'http';
		var httpRequest = (proto === 'https' ? https : http).get({
			host: host,
			port: proto === 'http' ? 80 : 443,
			path: '/job/' + job + '/lastBuild/api/json'
		}, function (response) {
			var responseText = '';
			response.on('data', function (chunk) {
				responseText += chunk.toString();
			});
			response.on('end', function () {
				var responseJson = JSON.parse(responseText);

				res.end(JSON.stringify({
					name: job,
					result: responseJson.result
				}));
			});
		});
		httpRequest.end();
	});
};