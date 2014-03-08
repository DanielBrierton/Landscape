module.exports = function (dashlet) {
	dashlet.rest('/', function (req, res) {
		res.end('Sample Widget REST');
	});
};