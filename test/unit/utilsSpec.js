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
			
			var shortDay = new Utils.SimpleDate(1,1,2013);
			expect(shortDay.format('dmy')).toEqual('01-Jan-2013');
		}));
		it('should add days correctly', inject(function(Utils) {
			var d = new Utils.SimpleDate(30,1,2013);
			expect(d.addDays(0).format('dmy')).toEqual('30-Jan-2013');
			expect(d.addDays(1).format('dmy')).toEqual('31-Jan-2013');
			expect(d.addDays(2).format('dmy')).toEqual('01-Feb-2013');

			expect(d.addDays(-1).format('dmy')).toEqual('29-Jan-2013');
			expect(d.addDays(-30).format('dmy')).toEqual('31-Dec-2012');
		}));
		it('should know if today',inject(function(Utils) {
			var today = Utils.SimpleDate.fromJsDate(new Date());
			expect(today.isToday()).toEqual(true);

			var someTimeAgo = new Utils.SimpleDate(1,1,2012);
			expect(someTimeAgo.isToday()).toEqual(false);
		}));
		it('should give week number',inject(function(Utils) {
			var d = new Utils.SimpleDate(30,1,2013);
			expect(d.weekNumber()).toEqual(5);

			var wikipediaExample = new Utils.SimpleDate(26,9,2008);
			expect(wikipediaExample.weekNumber()).toEqual(39);
		}));
	} );

});

