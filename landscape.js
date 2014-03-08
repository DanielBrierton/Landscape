var fs = require('fs'),
	express = require('express'),
	app = express(),
    htmlparser = require('htmlparser2'),
	port = parseInt(process.env.PORT, 10) || 5000;

var dashlet = function (dashletName) {
	return {
		dashletName: dashletName,
		rest: function (path, callback) {
			if (path === '/') {
				path = '';
			} else if (path.indexOf('/') !== 0) {
				path = '/' + path;
			}
			app.all('/dashlets/' + this.dashletName + path, callback);
		}
	};
};

var loadedDashlets = {};

var boardsDir = './public/boards/';
function createDashboard(boardTemplate) {
	var parser = new htmlparser.Parser({
		onopentag: function (name, attrs) {
			var dashletName = attrs['data-dashlet'];
			if (dashletName && !loadedDashlets[dashletName]) {
				var dashletPath = './dashlets/' + dashletName;
				var dashletUrl = '/dashlets/' + dashletName;
				fs.exists(dashletPath + '/server.js', function (exists) {
					if (exists) {
						require(dashletPath + '/server.js')(dashlet(dashletName));
					}
				});
				app.use(dashletUrl, express.static(__dirname + dashletUrl + '/public'));
				loadedDashlets[dashletName] = true;
			}
		}
	});

	fs.createReadStream(boardsDir + boardTemplate).pipe(parser);
}

fs.readdir(boardsDir, function (err, files) {
	files.forEach(function (boardTemplate) {
		createDashboard(boardTemplate);
	});
});

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log('Listening on port ' + port);
console.log('http://localhost:' + port + '/');