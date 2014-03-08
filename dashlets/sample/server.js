module.exports = function (dashlet, params) {
	dashlet.rest('/', function (req, res) {
		res.end('Sample Widget REST');
	});
};