/* Jasmine settings */
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

'use strict';

describe('appControllers', function() {
  beforeEach(module('AppControllers', 'Utils'));

  describe('AppCtrl', function() {
    var scope, ctrl, makeCtrl, SimpleDate;

    beforeEach(inject(function($rootScope, $controller, Utils) {
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

  });

});