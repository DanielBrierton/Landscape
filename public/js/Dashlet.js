define(function () {

	var Dashlet = function (container, options) {
		this.container = container;
		this.$container = $(container);
		this.init(options);
	};

	Dashlet.prototype = {
		getHTML: function () {
			this.$el = $('<div></div>');
			return this.$el;
		},

		getCSS: function () {
			return '';
		},

		init: function () {},

		onAttach: function () {},

		attachTo: function (parent) {
			$(parent).append(this.getHTML());
			this.onAttach();
		}
	};

	Dashlet.extend = function (obj) {
		var superClass = this;
		var subClass = function () {
			superClass.apply(this, arguments);
		};

        var Surrogate = function () {
            this.constructor = subClass;
        };

        Surrogate.prototype = superClass.prototype;
        subClass.prototype = new Surrogate();

		for (var prop in obj) {
			if (prop) {
				subClass.prototype[prop] = obj[prop];
			}
		}

        subClass.__super__ = superClass.prototype;

		return subClass;
	};

	return Dashlet;
});