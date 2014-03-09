define([
	'Dashlet',
	'text!./template.html',
	'text!./styles.css'
], function (Dashlet, template, styles) {

	return Dashlet.extend({
		init: function (options) {
			this.host = options.host;
			this.job = options.job;
			this.proto = options.protocol || 'http';
		},

		getHTML: function () {
			return template;
		},

		getCSS: function () {
			return styles;
		},

		onAttach: function () {
			this.$el.find('.job_name').text(this.job);
			$.ajax({
				url: '/dashlets/jenkins_status/' + this.host + '/' + this.job + '/' + this.proto,
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