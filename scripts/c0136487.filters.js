'use strict';
/*global angular:false, document:false */

/* Filters */
angular.module('trackFilters', []).
  filter('hour', function() {
    return function(input, onlyfull) {
      var fix = Math.floor(input),
          out;
			if (input != fix) {
        if (onlyfull) {
          return '';
        }
        out = fix + ':30';
			} else {
        out = fix + ':00';
      }

			if (out.length < 5) {
				out = '0' + out;
			}
      return out;
    };
  }
).filter('date',function() {
    return function(input,fmt) {
      return input.format(fmt);
    };
  }
).filter('mark',function() {
    var marks = ['','\u25D0','\u25C9','\u25C8'],
        maxMarks = marks.length-1;
    return function(input) {
      return marks[ Math.min(input,maxMarks) ];
    };
  }
).filter('choice',function() {
		return function(input,mask) {
			var steps = mask.split('|'),
				out = '';
			if (steps.length % 2 == 1) {
				out = steps.pop();
			}
			if (angular.isUndefined(input)) {
				input = '';
			} else {
				input = input.toString();
			}
			for (var i = 0 ; i < steps.length ; i++ ) {
				if (steps[i][0] == '>') {
					if (input >= steps[i].substr(1)) {
						return steps[i+1];
					}
				} else {
					if (input == steps[i]) {
						return steps[i+1];
					}
				}
			}
			return out;
		};
	}
).filter('fixedSizeHours',function() {
		return function(input) {
			var out = input.toString();
			if (out.indexOf('.') === -1) {
				out = out + '.0';
			}
			if (out.indexOf('.') < 2) {
				out = '\xA0' + out;
			}
			while (out.length < 5) {
				out = out + '\xA0';
			}
			return out;
		};
	}
);