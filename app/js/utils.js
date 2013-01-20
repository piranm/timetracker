'use strict';

/* Settings Controllers */

angular.module(
    'Utils', []
).service('Utils', function () {
	return {
		forRange: function (from,to,func) {
			for (var i = from ; i <= to ; i++ ) {
				func(i);
			}
		}
	};
});
