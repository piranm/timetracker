'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'Utils', []
).service('Utils', function () {
	function zeroPad(num, len) {
		var out = num.toString();
		while (out.length < len) {
			out = '0' + out;
		}
		return out;
	}
	function SimpleDate(day, month, year) {
		this.day = day;
		this.month = month;
		this.year = year;
	}
	SimpleDate.prototype.format = function (fmt) {
		var out = '';
		var parts = fmt.split(/(E+|d+|M+|y+|.)/);
		for (var i = 0 ; i < parts.length ; i++ ) {
			var p = parts[i];
			if (p.length > 0 ) {
				switch (p[0]) {
					case 'd':
						out = out + zeroPad(this.day, p.length);
						break;
					case 'E':
						out = out + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][this.dayOfWeek()];
						break;
					case 'M':
						if (p.length < 3) {
							out = out + zeroPad(this.month, p.length);
						} else {
							out = out + ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][this.month];
						}
						break;
					case 'y':
						out = out + zeroPad(this.year, p.length);
						break;
					default:
						out = out + p;
				}
			}
		}
		return out;
	};
	SimpleDate.prototype.dayOfWeek = function () {
		return this.toJsDate().getDay();
	};
	SimpleDate.prototype.toJsDate = function () {
		return new Date(this.year,this.month-1,this.day);
	};
	SimpleDate.prototype.addDays = function (delta) {
		var jsDate = new Date(this.year,this.month-1,this.day+delta);
		return SimpleDate.fromJsDate(jsDate);
	};
	SimpleDate.fromJsDate = function (jsDate) {
		return new SimpleDate(jsDate.getDate(),jsDate.getMonth()+1,jsDate.getFullYear());
	};
	SimpleDate.prototype.isToday = function () {
		var today = SimpleDate.fromJsDate(new Date());
		return this.equals(today);
	};
	SimpleDate.prototype.equals = function (other) {
		return (this.day === other.day) && (this.month === other.month) && (this.year === other.year);
	};
	SimpleDate.prototype.after = function (other) {
		var delta = this.year - other.year;
		if (delta === 0) {
			delta = this.month - other.month;
			if (delta === 0) {
				delta = this.day - other.day;
			}
		}
		return delta > 0;
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
