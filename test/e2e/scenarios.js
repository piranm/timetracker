'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/*global angular:false, describe:false, xdescribe:false, beforeEach:false, it:false, expect:false */
/*global browser:false, element:false, sleep:false, input:false, repeater:false */

angular.scenario.matcher('toShowText', function(expected) {
	return this.actual.replace(/\s+/g,' ').trim() == expected;
});

describe('Time Tracker app', function() {

	describe('settings', function() {
		// having problems with the navigate finishing, perhaps to do with ng-include???
		beforeEach(function() {
			browser().navigateTo('../../app/index.html#?debugToday=08012013');
		});

		it('should have three nav buttons', function () {
			expect(element('li').count()).toBe(3);
		});

		it('should go into debug mode', function () {
			expect(element('.weekContainer .weekTitle').text()).toShowText('Week 2 - 07-Jan to 13-Jan-2013');
			expect(element('#debug').count()).toBe(1);
			expect(element('#debugDay').val()).toEqual("08");
			expect(element('#debugMonth').val()).toEqual("01");
			expect(element('#debugYear').val()).toEqual("2013");
			expect(element('#debugHour').val()).toEqual("10");
			expect(element('#debugMinute').val()).toEqual("00");

			element('#debugTick').click();
			expect(element('.editDate').text()).toShowText('Tue 08-Jan-2013');
			expect(element('#currentTimeContainer').attr('class')).toEqual('now-10');
		});

		it('should update current hour on tick', function () {
			input('debugHour').enter("11");
			input('debugMinute').enter("30");
			element('#debugTick').click();
			expect(element('#currentTimeContainer').attr('class')).toEqual('now-11h');
		});

		it('should open new day on new day tick', function () {
			input('debugDay').enter("09");
			element('#debugTick').click();
			expect(element('.editDate').count()).toBe(2);
			expect(element('#day_20130108 .editDate').text()).toShowText('Tue 08-Jan-2013');
			expect(element('#day_20130109 .editDate').text()).toShowText('Wed 09-Jan-2013');
		});

		it("should open new week on new week's day tick", function () {
			input('debugDay').enter("15");
			element('#debugTick').click();
			expect(element('#day_20130115 .editDate').text()).toShowText('Tue 15-Jan-2013');
		});

	});

});
