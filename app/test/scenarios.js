'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/*global angular:false, describe:false, xdescribe:false, beforeEach:false, it:false, expect:false */
/*global browser:false, element:false, sleep:false, input:false, repeater:false */

angular.scenario.matcher('toShowText', function(expected) {
	return this.actual.replace(/\s+/g,' ').trim() == expected;
});

describe('Time Tracker app', function() {

	describe('settings', function() {
		beforeEach(function() {
			browser().navigateTo('../index.html#?debugToday=08012013');
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

	describe('export', function() {
		beforeEach(function() {
			browser().navigateTo('../index.html#?debugToday=08012013');
			element('#debugClearStorage').click();
			browser().navigateTo('../index.html#?debugToday=08012013');

			element('#day_20130108 .marktable tbody tr:nth-of-type(1) input').val("day 8 task 1");
			element('#day_20130108 .marktable tbody tr:nth-of-type(1) td:nth-of-type(2)').click();
			element('#day_20130108 .marktable tbody tr:nth-of-type(1) td:nth-of-type(3)').click();
			element('#day_20130108 .marktable tbody tr:nth-of-type(1) td:nth-of-type(3)').click();

			element('#day_20130108 .addTask').click();
			element('#day_20130108 .marktable tbody tr:nth-of-type(2) input').val("day 8 task 2");
			element('#day_20130108 .marktable tbody tr:nth-of-type(2) td:nth-of-type(3)').click();
			element('#day_20130108 .marktable tbody tr:nth-of-type(2) td:nth-of-type(3)').click();
			element('#day_20130108 .marktable tbody tr:nth-of-type(2) td:nth-of-type(4)').click();

			input('debugDay').enter("09");
			element('#debugTick').click();
			element('#day_20130109 .marktable tbody tr:nth-of-type(1) input').val("day 9 task 1");
			element('#day_20130109 .marktable tbody tr:nth-of-type(1) td:nth-of-type(2)').click();

			input('debugDay').enter("11");
			element('#debugTick').click();
			element('#day_20130111 .marktable tbody tr:nth-of-type(1) input').val("day 11 task 1");
			element('#day_20130111 .marktable tbody tr:nth-of-type(1) td:nth-of-type(2)').click();

			element('.optButtonsList li:nth-of-type(2)').click();
		});

		it('defaults are correct, and get saved', function () {
			expect(element(".exportTab input[type='radio'][name='exportWhat']:checked").attr('value')).toBe('tasks');
			expect(element(".exportTab input[type='radio'][name='exportFormat']:checked").attr('value')).toBe('csv');

			element(".exportTab input[type='radio'][name='exportWhat'][value='days']").click();
			element(".exportTab input[type='radio'][name='exportFormat'][value='excel']").click();

			browser().navigateTo('../index.html#?debugToday=08012013');
			element('.optButtonsList li:nth-of-type(2)').click();
			expect(element(".exportTab input[type='radio'][name='exportWhat']:checked").attr('value')).toBe('days');
			expect(element(".exportTab input[type='radio'][name='exportFormat']:checked").attr('value')).toBe('excel');
		});

		it('test task csv export', function () {
			element(".exportTab input[type='radio'][name='exportWhat'][value='tasks']").click();
			element(".exportTab input[type='radio'][name='exportFormat'][value='csv']").click();
			element('#debugExport').click();
			expect(element('#debugExportFilename').text()).toBe('timetracker.csv');
			expect(element('#debugExportMimeType').text()).toBe('text/csv');
			expect(element('#debugExportData').val()).toBe("\"date\",\"task\",\"hours\",\"start\"\n\"07-01-2013\",\"\",0\n\"08-01-2013\",\"\",0.75\n\"08-01-2013\",\"\",0.75\n\"09-01-2013\",\"\",0.5\n\"10-01-2013\",\"\",0\n\"11-01-2013\",\"\",0.5\n\"12-01-2013\",\"\",0\n\"13-01-2013\",\"\",0\n");
		});

		it('test days csv export', function () {
			element(".exportTab input[type='radio'][name='exportWhat'][value='days']").click();
			element(".exportTab input[type='radio'][name='exportFormat'][value='csv']").click();
			element('#debugExport').click();
			expect(element('#debugExportFilename').text()).toBe('timetracker.csv');
			expect(element('#debugExportMimeType').text()).toBe('text/csv');
			expect(element('#debugExportData').val()).toBe("\"date\",\"comment\",\"hours\"\n\"07-01-2013\",\"\",0\n\"08-01-2013\",\"\",1.5\n\"09-01-2013\",\"\",0.5\n\"10-01-2013\",\"\",0\n\"11-01-2013\",\"\",0.5\n\"12-01-2013\",\"\",0\n\"13-01-2013\",\"\",0\n");
		});
	});

});
