var fs = require('fs'),
	express = require('express'),
	app = express(),
    htmlparser = require('htmlparser2'),
    less = require('less'),
	port = parseInt(process.env.PORT, 10) || 5000;

app.set('view engine', 'hbs');

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
			if (attrs['data-dashlet'] && !loadedDashlets[attrs['data-dashlet']]) {
				var dashletParams = {};
				for (var key in attrs) {
					if (key.indexOf('data-') === 0 && key !== 'data-dashlet') {
						dashletParams[key.substr(5)] = attrs[key];
					}
				}
				var dashletPath = './dashlets/' + attrs['data-dashlet'];
				fs.exists(dashletPath + '/server.js', function (exists) {
					if (exists) {
						require(dashletPath + '/server.js')(dashlet(attrs['data-dashlet']), dashletParams);
					}
				});
				fs.exists(dashletPath + '/template.html', function (exists) {
					if (exists) {
						app.get(dashletPath.substr(1) + '/template.html', function (req, res) {
							fs.createReadStream(dashletPath + '/template.html').pipe(res);
						});
					}
				});
				fs.exists(dashletPath + '/styles.less', function (exists) {
					if (exists) {
						fs.readFile(dashletPath + '/styles.less', function (err, data) {
							if (err) throw err;
							less.render(data.toString(), function (e, css) {
								app.get(dashletPath.substr(1) + '/styles.css', function (req, res) {
									res.end(css);
								});
							});
						});
					}
				});
				loadedDashlets[attrs['data-dashlet']] = true;
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