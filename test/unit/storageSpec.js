'use strict';
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

/* jasmine specs for filters go here */

describe('Storage', function() {
	
	beforeEach(module('Storage'));
	
	describe("day storage", function() {

		beforeEach(inject(function(Storage) {
			Storage.clear();
		}));

		it("should create empty day for new date", inject(function(Storage, Utils) {
			var date = new Utils.SimpleDate(30,1,2013);
			var day = Storage.getDayRecord(date);
			expect(day.comment).toEqual('');
			expect(day.total).toEqual(0.0);
			expect(day.tasks.length).toBe(1);
			expect(day.tasks[0].task).toEqual('');
			expect(day.tasks[0].marks.length).toEqual(48);
		}));

		it("should store and retrieve days", inject(function(Storage, Utils) {
			var date = new Utils.SimpleDate(30,1,2013);
			var day = Storage.getDayRecord(date);

			day.comment = 'day comment';
			day.total = 23;
			day.tasks[0].task = 'first';
			day.tasks[0].marks[0] = 2;
			day.tasks.push( {task: 'second', marks:[0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});

			Storage.setDayRecord(date, day);
			var retrieved = Storage.getDayRecord(date);
			expect(retrieved.comment).toEqual('day comment');
			expect(retrieved.total).toEqual(23);
			expect(retrieved.tasks.length).toBe(2);
			expect(retrieved.tasks[0].task).toEqual('first');
			expect(retrieved.tasks[0].marks.length).toEqual(48);
			expect(retrieved.tasks[0].marks[0]).toEqual(2);
			expect(retrieved.tasks[0].marks[1]).toEqual(0);
			expect(retrieved.tasks[1].task).toEqual('second');
			expect(retrieved.tasks[1].marks.length).toEqual(48);
			expect(retrieved.tasks[1].marks[0]).toEqual(0);
			expect(retrieved.tasks[1].marks[1]).toEqual(2);
			expect(retrieved.tasks[1].marks[2]).toEqual(1);
		}));

		it("should clear stored days and settings", inject(function(Storage, Utils) {
			var date = new Utils.SimpleDate(30,1,2013);
			var day = Storage.getDayRecord(date);

			day.comment = 'day comment';
			Storage.setDayRecord(date, day);
			Storage.setSettings({test:'value'});

			Storage.clear();

			var retrieved = Storage.getDayRecord(date);
			expect(retrieved.comment).toEqual('');
			expect(Storage.getSettings()).toEqual({});
		}));

		it("should store settings", inject(function(Storage) {
			var settings = Storage.getSettings();
			expect(Storage.getSettings()).toEqual({});

			settings.test = 'value';
			Storage.setSettings(settings);

			expect(Storage.getSettings()).toEqual({test:'value'});
		}));
	} );

});

