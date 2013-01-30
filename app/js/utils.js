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
				if (this.day < 10) {
					out = out + '0';
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
	SimpleDate.prototype.addDays = function (delta) {
		var jsDate = new Date(this.year,this.month-1,this.day+delta);
		return SimpleDate.fromJsDate(jsDate);
	};
	SimpleDate.fromJsDate = function (jsDate) {
		return new SimpleDate(jsDate.getDate(),jsDate.getMonth()+1,jsDate.getFullYear());
	};
	SimpleDate.prototype.isToday = function () {
		var today = new Date();
		return (this.day === today.getDate()) && (this.month === today.getMonth()+1) && (this.year === today.getFullYear());
	};
	SimpleDate.prototype.weekNumber = function() {
		var monthStart = [0,31,59,90,120,151,181,212,243,273,304,334][this.month-1];
		var isLeap = (this.year % 4 === 0) && (this.year % 100 !== 0) || (this.year % 400 === 0);
		if (this.month > 2 && isLeap) {
			monthStart += 1;
		}
		var dayOfWeek = this.dayOfWeek()-1;
		if (dayOfWeek < 0) {
			dayOfWeek += 7;
		}
		var weekNumber = Math.floor((monthStart + this.day - dayOfWeek + 10)/7);
		return weekNumber;
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
