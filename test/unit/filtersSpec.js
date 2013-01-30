'use strict';
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

/* jasmine specs for filters go here */

describe('filter', function() {
	
	beforeEach(module('trackFilters'));
	
	describe('hour', function() {
		it('should format hours', inject(function(hourFilter) {
			expect(hourFilter(0)).toBe('00:00');
			expect(hourFilter(5)).toBe('05:00');
			expect(hourFilter(10)).toBe('10:00');
			expect(hourFilter(14.5)).toBe('14:30');
		}));

		it('should format only full hours', inject(function(hourFilter) {
			expect(hourFilter(0, true)).toBe('00:00');
			expect(hourFilter(5, true)).toBe('05:00');
			expect(hourFilter(10, true)).toBe('10:00');
			expect(hourFilter(14.5, true)).toBe('');
		}));
	} );
	
	describe('mark', function() {
		it('should format marks correctly', inject(function(markFilter) {
			expect(markFilter(0)).toBe('');
			expect(markFilter(1)).toBe('\u25D0');
			expect(markFilter(2)).toBe('\u25C9');
			expect(markFilter(3)).toBe('\u25C9');
			expect(markFilter(3)).toBe('\u25C9');
		}));
	} );
	
	describe('choice', function() {
		it('should treat undefined as blank', inject(function(choiceFilter) {
			expect(choiceFilter(undefined,'|blank|other')).toBe('blank');
			expect(choiceFilter(undefined,'||other')).toBe('');
		}));

		it('should treat undefined as blank', inject(function(choiceFilter) {
			expect(choiceFilter(undefined,'|blank|other')).toBe('blank');
			expect(choiceFilter(undefined,'||other')).toBe('');
		}));

		it('should work with booleans', inject(function(choiceFilter) {
			expect(choiceFilter(true,'true|yes|no')).toBe('yes');
			expect(choiceFilter(false,'true|yes|false|no')).toBe('no');
		}));

		it('should perform empty matching', inject(function(choiceFilter) {
			expect(choiceFilter('','|blank|other')).toBe('blank');
			expect(choiceFilter('x','|blank|other')).toBe('other');

			expect(choiceFilter('','||other')).toBe('');
			expect(choiceFilter('x','||other')).toBe('other');
		}));

		it('should match >3', inject(function(choiceFilter) {
			expect(choiceFilter(2,'>3|something')).toBe('');
			expect(choiceFilter(3,'>3|something')).toBe('something');
			expect(choiceFilter(4,'>3|something')).toBe('something');
		}));
		
	});

});

