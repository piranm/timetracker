/* Jasmine settings */
/*global describe:false, beforeEach:false, it:false, expect:false, spyOn:false */
/*global module:false, inject:false */

'use strict';

describe('appControllers', function() {
  beforeEach(module('AppControllers', 'Utils'));

  describe('AppCtrl', function() {
    var scope, ctrl, makeCtrl, SimpleDate, Utils;

    beforeEach(inject(function($rootScope, $controller, _Utils_) {
      Utils = _Utils_;
      scope = $rootScope.$new();
      makeCtrl = function() {
        ctrl = $controller('AppCtrl', {$scope: scope});
      };
      SimpleDate = Utils.SimpleDate;
      this.addMatchers({
        toEqualDate: function(day,month,year) {
          var actual = this.actual;
          var expected = new Utils.SimpleDate(day,month,year);
          var notText = this.isNot ? " not" : "";
          this.message = function () {
            return "Expected " + actual.format('dd-MMM-yyyy') + notText + " to be " + expected.format('dd-MMM-yyyy');
          };
          return actual.equals(expected);
        }
      });
    }));

    describe('debugSettings', function () {
      it("should not be in debug mode by default", function () {
        makeCtrl();
        expect(scope.debug).not.toBeTruthy();
      });
      it("should pick up debug today", inject(function ($location) {
        $location.search('debugToday','07012013');
        makeCtrl();
        expect(scope.debug).toBeTruthy();
        expect(scope.today.format('dd-MMM-yyyy')).toEqual('07-Jan-2013');
        expect(scope.weeks.length).toBe(1);
        expect(scope.weeks[0].start).toEqualDate(7,1,2013);
      }));
    });

    describe('notification', function () {
      var dayRecord;
      beforeEach(function () {
        dayRecord = { tasks: [{marks:[]}]};
        Utils.forRange(0,47,function () { dayRecord.tasks[0].marks.push(0); });
      });

      it("should correctly calculate message", function () {
        var msg;
        makeCtrl();
        var now = new Date();
        
        now.setHours(9); now.setMinutes(0);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toEqual("You've not filled in your time today.");

        dayRecord.tasks[0].marks[20] = 1;
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toBe(undefined);

        now.setHours(10); now.setMinutes(0);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toBe(undefined);

        now.setHours(10); now.setMinutes(30);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toBe(undefined);

        now.setHours(11); now.setMinutes(0);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toEqual("You're half-an-hour behind.");

        now.setHours(11); now.setMinutes(30);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toEqual("You're one hour behind.");

        now.setHours(13); now.setMinutes(0);
        msg = scope.makeNotificationMessage(dayRecord, now);
        expect(msg).toEqual("You're 2.5hrs behind.");
      });

      it("should know working hours", function () {
        var msg;
        makeCtrl();
        scope.settings.workStart = 9.5; scope.settings.workEnd = 17.5;
        var now = new Date();
        
        now.setHours(9); now.setMinutes(0);
        expect(scope.isInWorkHours(now)).toEqual(false);

        now.setHours(9); now.setMinutes(30);
        expect(scope.isInWorkHours(now)).toEqual(true);

        now.setHours(17); now.setMinutes(30);
        expect(scope.isInWorkHours(now)).toEqual(true);

        now.setHours(18); now.setMinutes(0);
        expect(scope.isInWorkHours(now)).toEqual(false);
      });
    });

    describe('week handling', function () {
      it("should start with today's date and one week on a Monday", function () {
        scope.today = new SimpleDate(7,1,2013);
        makeCtrl();
        expect(scope.weeks.length).toBe(1);
        expect(scope.weeks[0].start).toEqualDate(7,1,2013);
      });
      it("should start with today's date and one week on a Wednesday", function () {
        scope.today = new SimpleDate(9,1,2013);
        makeCtrl();
        expect(scope.weeks[0].start).toEqualDate(7,1,2013);
      });
      it("should start with today's date and one week on a Sunday", function () {
        scope.today = new SimpleDate(13,1,2013);
        makeCtrl();
        expect(scope.weeks[0].start).toEqualDate(7,1,2013);
      });
      it("should add another week before", function () {
        scope.today = new SimpleDate(7,1,2013);
        makeCtrl();
        scope.showPreviousWeek();
        expect(scope.weeks.length).toBe(2);
        expect(scope.weeks[0].start).toEqualDate(31,12,2012);
      });
      it("should open to the beginning of the month", function () {
        scope.today = new SimpleDate(7,1,2013);
        makeCtrl();
        scope.showPreviousMonth();
        expect(scope.weeks.length).toBe(2);
        expect(scope.weeks[0].start).toEqualDate(31,12,2012);
      });
      it("should open to the previous of the month if necessary", function () {
        scope.today = new SimpleDate(1,4,2013);
        makeCtrl();
        scope.showPreviousMonth();
        expect(scope.weeks.length).toBe(6);
        expect(scope.weeks[0].start).toEqualDate(25,2,2013);
        expect(scope.weeks[1].start).toEqualDate( 4,3,2013);
        expect(scope.weeks[2].start).toEqualDate(11,3,2013);
        expect(scope.weeks[3].start).toEqualDate(18,3,2013);
        expect(scope.weeks[4].start).toEqualDate(25,3,2013);
      });
      it("should hide extra weeks", function () {
        scope.today = new SimpleDate(1,4,2013);
        makeCtrl();
        scope.showPreviousMonth();
        expect(scope.weeks.length).toBe(6);
        scope.hideExtraWeeks();
        expect(scope.weeks.length).toBe(1);
        expect(scope.weeks[0].start).toEqualDate(1,4,2013);
        scope.hideExtraWeeks();
        expect(scope.weeks.length).toBe(1);
      });
    });

    describe('date changes', function () {
      it("should broadcast when the date changes within week", inject(function ($timeout) {
        scope.today = new SimpleDate(7,1,2013);
        makeCtrl();
        spyOn(scope,'$broadcast');

        scope.halfHourAction(new Date(2013,0,8,10,0,0));
        expect(scope.$broadcast.calls.length).toBe(0);

        $timeout.flush();
        expect(scope.$broadcast.calls.length).toBe(1);
        expect(scope.$broadcast.calls[0].args[0]).toEqual('showDate');
        expect(scope.$broadcast.calls[0].args[1].equals(new SimpleDate(8,1,2013))).toBeTruthy();
        expect(scope.weeks.length).toBe(1);
        expect(scope.today.equals(new SimpleDate(8,1,2013))).toBeTruthy();
      }));
      it("should add weeks when the date changes beyond last week", inject(function ($timeout) {
        scope.today = new SimpleDate(7,1,2013);
        makeCtrl();
        spyOn(scope,'$broadcast');

        scope.halfHourAction(new Date(2013,0,21,10,0,0));
        expect(scope.$broadcast.calls.length).toBe(0);

        $timeout.flush();
        expect(scope.$broadcast.calls.length).toBe(1);
        expect(scope.$broadcast.calls[0].args[0]).toEqual('showDate');
        expect(scope.$broadcast.calls[0].args[1].equals(new SimpleDate(21,1,2013))).toBeTruthy();
        expect(scope.weeks.length).toBe(3);
        expect(scope.today.equals(new SimpleDate(21,1,2013))).toBeTruthy();
      }));
    });
  });

});