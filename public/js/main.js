require.config({
    paths: {
        text: 'js/text',
        Dashlet: 'js/Dashlet'
    }
});

$(function () {
    var loadedBoards = {};
    var $dashboard = $('#dashboard');
    window.onhashchange = function () {
        loadBoard(window.location.hash.substr(1));
    }

    function loadBoard(boardName) {
        var board = 'boards/' + boardName + '.html';
        require([
            'text!./' + board
        ], function (template) {
            $dashboard.html(template);
            $dashboard.find('div[data-dashlet]').each(function (i, dashletEl) {
                var $dashletEl = $(dashletEl);
                var dashletName = $dashletEl.attr('data-dashlet');
                var dashletParams = {};
                for (var key in dashletEl.dataset) {
                    if (key !== 'dashlet') {
                        dashletParams[key] = dashletEl.dataset[key];
                    }
                }
                require([
                    './dashlets/' + dashletName + '/Dashlet',
                ], function (Dashlet) {
                    var dashlet = new Dashlet(dashletParams);
                    dashlet._attachTo($dashletEl);
                    if (!loadedBoards[dashletName]) {
                        var $styleTag = $('<style type="text/css">' + dashlet.getCSS() + '</style>');
                        $('head').append($styleTag);
                        loadedBoards[dashletName] = true;
                    }
                });
            });
            $(dashboard).find('ul').gridster({
                widget_margins: [10, 10],
                widget_base_dimensions: [240, 240],
                max_cols: 4,
                min_cols: 4
            });
        });
    }

    loadBoard(window.location.hash.substr(1));
});