'use strict';

/* Filters */
angular.module('trackFilters', []).
  filter('hour', function() {
    return function(input) {
      var fix = input.toFixed(0),
          out = fix + ':00';
			if (input != fix) {
				return '';
			}
			if (out.length < 5) {
				out = '0' + out;
			}
      return out;
    }
  }
).filter('mark',function() {
		var marks = ['','\u25D0','\u25C9']
		  , maxMarks = marks.length-1;
		return function(input) {
			return marks[ Math.min(input,maxMarks) ];
		}
	}
).filter('choice',function() {
		return function(input,mask) {
			var steps = mask.split('|')
				, out = '';
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
		}
	}
);