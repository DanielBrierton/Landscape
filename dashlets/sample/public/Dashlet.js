define([
	'Dashlet',
	'text!./template.html',
	'text!./styles.css'
], function (Dashlet, template, styles) {

	return Dashlet.extend({

		colors: ['red', 'blue', 'teal', 'green'],

		init: function (options) {
			this.options = options;
		},

		onAttach: function () {
			this.$el.click(function () {
				this.$el.css({
					background: this.colors[Math.floor(Math.random()*this.colors.length)]
				});
			}.bind(this));
		},

		getHTML: function () {
			this.$el = $(Handlebars.compile(template)(this.options));
			return this.$el;
		},

		getCSS: function () {
			return styles;
		}
	});

});