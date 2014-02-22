(function () {

	'use strict';

	String.prototype.sprintf = function () {

		var value = this,
			item;

		for (item in arguments) {

			if (arguments.hasOwnProperty(item)) {

				value = value.replace(/\{\}/, arguments[item]);

			}

		}

		return value;

	};

	console.assert = function (expression, message) {

		if (!expression) {

			throw (message || 'Assertion failed!');

		}

	};

}());