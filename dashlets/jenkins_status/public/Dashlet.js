define([
    'Dashlet',
    'text!./template.html',
    'text!./styles.css'
], function (Dashlet, template, styles) {

    return Dashlet.extend({
        init: function (options) {
            this.proto = options.protocol || 'http';
            this.host = options.host;
            this.path = options.path || '';
            this.job = options.job;
            this.interval = options.interval || 30000;
        },

        getHTML: function () {
            return template;
        },

        getCSS: function () {
            return styles;
        },

        onAttach: function () {
            this.checkStatus();
            setInterval(this.checkStatus.bind(this), this.interval);
        },

        checkStatus: function () {
            this.$el.find('.job_name').text(this.job);
            $.ajax({
                url: '/dashlets/jenkins_status/' + this.proto + '/' + this.host + encodeURIComponent(this.path) + '/' + this.job,
                success: this.onSuccess.bind(this),
                dataType: 'json'
            });
        },

        onSuccess: function (job) {
            this.$el.attr({
                class: 'jenkins_status jenkins_status_' + job.result
            });
        }
    });

});
