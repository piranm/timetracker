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
			expect(d.format('EEE dd-MMM-yyyy')).toEqual('Wed 30-Jan-2013');
			expect(d.format('dd-MMM-yyyy')).toEqual('30-Jan-2013');
			expect(d.format('dd-MMM')).toEqual('30-Jan');
			
			var shortDay = new Utils.SimpleDate(1,1,2013);
			expect(shortDay.format('dd-MMM-yyyy')).toEqual('01-Jan-2013');

			expect(d.format('yyyy-MM-dd')).toEqual('2013-01-30');
			expect(shortDay.format('yyyy-MM-dd')).toEqual('2013-01-01');
		}));
		it('should add days correctly', inject(function(Utils) {
			var d = new Utils.SimpleDate(30,1,2013);
			expect(d.addDays(0).format('dd-MMM-yyyy')).toEqual('30-Jan-2013');
			expect(d.addDays(1).format('dd-MMM-yyyy')).toEqual('31-Jan-2013');
			expect(d.addDays(2).format('dd-MMM-yyyy')).toEqual('01-Feb-2013');

			expect(d.addDays(-1).format('dd-MMM-yyyy')).toEqual('29-Jan-2013');
			expect(d.addDays(-30).format('dd-MMM-yyyy')).toEqual('31-Dec-2012');
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
		it('should match equality',inject(function(Utils) {
			var target = new Utils.SimpleDate(30,1,2013);
			var same   = new Utils.SimpleDate(30,1,2013);
			var differentDay = new Utils.SimpleDate(29,1,2013);
			var differentMonth = new Utils.SimpleDate(30,2,2013);
			var differentYear = new Utils.SimpleDate(30,1,2014);

			expect(target.equals(target)).toBe(true);
			expect(target.equals(same)).toBe(true);
			expect(target.equals(differentDay)).toBe(false);
			expect(target.equals(differentMonth)).toBe(false);
			expect(target.equals(differentYear)).toBe(false);
		}));
		it('should find after()',inject(function(Utils) {
			var target = new Utils.SimpleDate(10,2,2013);
			var same   = new Utils.SimpleDate(10,2,2013);
			var beforeDay = new Utils.SimpleDate(8,2,2013);
			var afterDayBeforeMonth = new Utils.SimpleDate(20,1,2013);
			var afterDayAfterMonthBeforeYear = new Utils.SimpleDate(20,3,2010);

			expect(target.after(target)).toBe(false);
			expect(target.after(same)).toBe(false);
			expect(target.after(beforeDay)).toBe(true);
			expect(beforeDay.after(target)).toBe(false);
			expect(target.after(afterDayBeforeMonth)).toBe(true);
			expect(afterDayBeforeMonth.after(target)).toBe(false);
			expect(target.after(afterDayAfterMonthBeforeYear)).toBe(true);
			expect(afterDayAfterMonthBeforeYear.after(target)).toBe(false);
		}));
	} );

});

