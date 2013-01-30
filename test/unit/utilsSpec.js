'use strict';
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

/* jasmine specs for filters go here */

describe('Utils', function() {
	
	beforeEach(module('Utils'));
	
	describe('SimpleDate', function() {
		it('should create ok', inject(function(Utils) {
			var d = new Utils.SimpleDate(30,1,2013);
			expect(d.year).toBe(2013);
			expect(d.month).toBe(1);
			expect(d.day).toBe(30);
			expect(d.dayOfWeek()).toBe(3); // Wed
		}));
		it('should format correctly', inject(function(Utils) {
			var d = new Utils.SimpleDate(30,1,2013);
			expect(d.format('Ddmy')).toEqual('Wed 30-Jan-2013');
			expect(d.format('dmy')).toEqual('30-Jan-2013');
			expect(d.format('dm')).toEqual('30-Jan');
		}));
	} );

});

