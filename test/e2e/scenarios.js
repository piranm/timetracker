'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/*global describe:false, xdescribe:false, beforeEach:false, it:false, expect:false */
/*global browser:false, element:false, sleep:false */

describe('Time Tracker app', function() {

	xdescribe('settings', function() {
		// having problems with the navigate finishing, perhaps to do with ng-include???
		beforeEach(function() {
			browser().navigateTo('../../app/index.html');
			sleep(1);
		});

		it('should have three nav buttons', function () {
			expect(element('li').count()).toBe(3);
		});

	});

});
