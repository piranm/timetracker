'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'Utils', []
).service('Utils', function () {
	function SimpleDate(day, month, year) {
		this.day = day;
		this.month = month;
		this.year = year;
	}
	SimpleDate.prototype.format = function (fmt) {
		var out = '';
		for (var i = 0 ; i < fmt.length; i++) {
			var p = fmt[i];
			if (p === "D") {
				out = out + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][this.dayOfWeek()];
			}
			if (p === 'd') {
				if (out !== '') {
					out = out + ' ';
				}
				out = out + this.day;
			}
			if (p === 'm') {
				if (out !== '') {
					out = out + '-';
				}
				out = out + ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][this.month];
			}
			if (p === 'y') {
				if (out !== '') {
					out = out + '-';
				}
				out = out + this.year;
			}
		}
		return out;
	};
	SimpleDate.prototype.dayOfWeek = function () {
		return new Date(this.year,this.month-1,this.day).getDay();
	};

	return {
		forRange: function (from,to,func) {
			for (var i = from ; i <= to ; i++ ) {
				func(i);
			}
		},

		SimpleDate: SimpleDate
	};
});
