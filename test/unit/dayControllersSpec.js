/* Jasmine settings */
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

'use strict';

describe('dayControllers', function() {
  beforeEach(module('DayControllers'));

  function makeTask(name) {
    var v = {
      task: name,
      marks: repeat(48,0),
      set: function(hour, val) {
        this.marks[hour*2] = val;
        return this;
      }
    };
    return v;
  }

  function repeat(times,value) {
    var a = [];
    for (var i = 0 ; i < times ; i++) {
      a.push(value);
    }
    return a;
  }

  describe('DayCtrl', function () {
    var scope, element, makeElement;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      makeElement = function() {
        element = $compile('<div day-view="forDate"></div>')(scope);
      };
    }));

    it("should open if created on today", inject(function (Utils) {
      scope.forDate = new Utils.SimpleDate(2,1,2013);
      scope.today = new Utils.SimpleDate(2,1,2013);
      makeElement();
      expect(element.scope().dayOpen).toBe(true);
    }));

    it("should open if date changes to it's date", inject(function (Utils) {
      scope.forDate = new Utils.SimpleDate(2,1,2013);
      scope.today = new Utils.SimpleDate(20,12,2013);
      makeElement();
      expect(element.scope().dayOpen).toBe(false);

      var wrongDate = new Utils.SimpleDate(1,1,2013);
      scope.$broadcast('showDate', wrongDate);
      expect(element.scope().dayOpen).toBe(false);

      var rightDate = new Utils.SimpleDate(2,1,2013);
      scope.$broadcast('showDate', rightDate);
      expect(element.scope().dayOpen).toBe(true);
    }));

    it("should set id to date", inject(function (Utils) {
      scope.forDate = new Utils.SimpleDate(2,1,2013);
      scope.today = new Utils.SimpleDate(2,1,2013);
      makeElement();
      expect(element.attr('id')).toEqual('day_20130102');
    }));

  });

  describe('DayEditorCtrl', function() {
    var scope, ctrl, makeCtrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      makeCtrl = function() {
        ctrl = $controller('DayEditorCtrl', {$scope: scope});
      };
    }));

    describe('should track the showRange and hours', function () {
      it('work in normal conditions', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(8);
        expect(scope.hourEnd).toBe(10);
        expect(scope.showRange).toEqual([16,17,18,19,20,21]);

        scope.addBefore();
        expect(scope.hourStart).toBe(7);
        expect(scope.hourEnd).toBe(10);
        expect(scope.showRange).toEqual([14,15,16,17,18,19,20,21]);

        scope.addAfter();
        expect(scope.hourStart).toBe(7);
        expect(scope.hourEnd).toBe(11);
        expect(scope.showRange).toEqual([14,15,16,17,18,19,20,21,22,23]);
      });
      it('be limited', function () {
        scope.settings = {showStart: 0, showEnd: 23};
        scope.day = {
          tasks: [
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(0);
        expect(scope.hourEnd).toBe(23);
        var initRange = scope.showRange.slice(0); // duplicate: see http://stackoverflow.com/a/4136943/1402988

        scope.addBefore();
        expect(scope.hourStart).toBe(0);
        expect(scope.hourEnd).toBe(23);
        expect(scope.showRange).toEqual(initRange);

        scope.addAfter();
        expect(scope.hourStart).toBe(0);
        expect(scope.hourEnd).toBe(23);
        expect(scope.showRange).toEqual(initRange);
      });
    });

    describe('should find start and end days', function () {
      it('use settings if no tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(8);
        expect(scope.hourEnd).toBe(10);
      });
      it('use settings if time encompasses task marks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(9,1)
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(8);
        expect(scope.hourEnd).toBe(10);
      });
      it('ignore settings if time inside task marks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(7,1).set(11,1)
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(7);
        expect(scope.hourEnd).toBe(11);
      });
      it('use min and max of all tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(7,1).set(11,1),
            makeTask('one').set(5,1).set(13,1),
            makeTask('one').set(6,1).set(12,1)
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(5);
        expect(scope.hourEnd).toBe(13);
      });
      it('half hours should round correctly', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(5.5,1).set(13.5,1)
          ]
        };
        makeCtrl();
        expect(scope.hourStart).toBe(5);
        expect(scope.hourEnd).toBe(13);
      });
    });

    describe('should calculate summary', function () {
      it('be all zeros for no tasks or empty tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
          ]
        };
        makeCtrl();
        expect(scope.summary).toEqual(repeat(48,0));
        expect(scope.taskSummary).toEqual([]);
        expect(scope.day.total).toEqual(0);

        scope.addTask();
        expect(scope.day.tasks.length).toBe(1);
        expect(scope.summary).toEqual(repeat(48,0));
        expect(scope.taskSummary).toEqual([0]);
        expect(scope.day.total).toEqual(0);
      });
      it('to sum up tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(0,1).set(0.5,2),
            makeTask('two').set(0.5,2).set(1,1)
          ]
        };
        makeCtrl();
        expect(scope.summary).toEqual([1,4,1].concat(repeat(45,0)));
        expect(scope.taskSummary).toEqual([0.75,0.75]);
        expect(scope.day.total).toEqual(1.5);
      });
      it('to change when mark changed', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(0,1).set(0.5,2)
          ]
        };
        makeCtrl();
        expect(scope.summary).toEqual([1,2].concat(repeat(46,0)));
        expect(scope.taskSummary).toEqual([0.75]);
        expect(scope.day.total).toEqual(0.75);

        scope.changeMark(0,1);
        expect(scope.summary).toEqual([1,1].concat(repeat(46,0)));
        expect(scope.taskSummary).toEqual([0.5]);
        expect(scope.day.total).toEqual(0.5);
      });
      it('to change if tasks removed', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(0,1).set(0.5,2),
            makeTask('two').set(0.5,2).set(1,1)
          ]
        };
        makeCtrl();
        expect(scope.summary).toEqual([1,4,1].concat(repeat(45,0)));
        expect(scope.taskSummary).toEqual([0.75,0.75]);
        expect(scope.day.total).toEqual(1.5);

        scope.removeTask(1);
        expect(scope.summary).toEqual([1,2,0].concat(repeat(45,0)));
        expect(scope.taskSummary).toEqual([0.75]);
        expect(scope.day.total).toEqual(0.75);
      });
    });

    describe('make tasks', function () {
      it('should add tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(0,1).set(0.5,2)
          ]
        };
        makeCtrl();

        scope.addTask();
        expect(scope.day.tasks.length).toBe(2);
        expect(scope.day.tasks[1].task).toEqual('');
        expect(scope.day.tasks[1].marks).toEqual(repeat(48,0));
      });
      it('should delete tasks', function () {
        scope.settings = {showStart: 8, showEnd: 10};
        scope.day = {
          tasks: [
            makeTask('one').set(0,1).set(0.5,2),
            makeTask('two').set(0.5,2)
          ]
        };
        makeCtrl();

        scope.removeTask(1);
        expect(scope.day.tasks.length).toBe(1);
        expect(scope.day.tasks[0].task).toEqual('one');
      });
    });

  });



});