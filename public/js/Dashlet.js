define(function () {

	var Dashlet = function (options) {
		this.init(options);
	};

	Dashlet.prototype = {
		getHTML: function () {
			return '<div></div>';
		},

		getCSS: function () {
			return '';
		},

		init: function () {},

		onAttach: function () {},

		_attachTo: function (parent) {
			this.$el = $(this.getHTML());
			$(parent).append(this.$el);
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