var http = require('http'),
    https = require('https');

module.exports = function (dashlet) {

    var getJobInfo = function (req, res) {
        var proto = req.params.proto || 'http';
        var host = req.params.host;
        var path = req.params.path || '';
        path = decodeURIComponent(path);
        var job = req.params.job;
        var httpRequest = (proto === 'https' ? https : http).get(proto + '://' + host + path + '/job/' + job + '/lastBuild/api/json', function (response) {
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
    }

    dashlet.rest('/:proto/:host/:path/:job', getJobInfo);

    dashlet.rest('/:proto/:host/:job', getJobInfo);
};
