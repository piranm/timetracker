'use strict';

/* Main Controllers */
/*global angular:false */

angular.module(
    'DayControllers', ['Storage','Utils']
).directive('dayView', function DayCtrl(Storage, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.date = scope.$eval(attrs.dayView);
            scope.dayOpen = scope.date.equals(scope.today);
            element.attr('id','day_'+scope.date.format('yyyyMMdd'));
            scope.day = Storage.getDayRecord(scope.date);
            scope.$watch('day', function(newValue) { Storage.setDayRecord(scope.date,newValue); }, true);

            scope.$on('showDate', function (event, newDate) {
                if (scope.date.equals(newDate)) {
                    if (!scope.dayOpen) {
                        scope.dayOpen = true;
                        $timeout(function() {element[0].scrollIntoView();}, 1, false);
                    }
                }
            });
        }
    };
}

).controller('DayEditorCtrl', function DayEditorCtrl($scope, Utils) {
    function firstHourWorked(day) {
        for (var h = 0 ; h < 24 ; h++) {
            for (var t = 0; t < day.tasks.length; t++) {
                if ( day.tasks[t].marks[h*2] !== 0 || day.tasks[t].marks[h*2+1] !== 0 ) {
                    return h;
                }

            }
        }
        return 24;
    }

    function lastHourWorked(day) {
        for (var h = 24-1 ; h >= 0 ; h--) {
            for (var t = 0; t < day.tasks.length; t++) {
                if ( day.tasks[t].marks[h*2] !== 0 || day.tasks[t].marks[h*2+1] !== 0 ) {
                    return h;
                }

            }
        }
        return 0;
    }

    $scope.hourStart = Math.min($scope.settings.showStart, firstHourWorked($scope.day));
    $scope.hourEnd   = Math.max($scope.settings.showEnd,   lastHourWorked($scope.day));


    function makeShowRange() {
        $scope.showRange = [];
        for (var h = $scope.hourStart ; h <= $scope.hourEnd; h++) {
            $scope.showRange.push(h*2, h*2+1);
        }
    }
    makeShowRange();

    $scope.addBefore = function() {
        $scope.hourStart = Math.max(0,$scope.hourStart-1);
        makeShowRange();
    };

    $scope.addAfter = function() {
        $scope.hourEnd = Math.min(23,$scope.hourEnd+1);
        makeShowRange();
    };

    $scope.collStyle = [
        'time-0 ',
        'time-0h',
        'time-1',
        'time-1h',
        'time-2',
        'time-2h',
        'time-3',
        'time-3h',
        'time-4',
        'time-4h',
        'time-5',
        'time-5h',
        'time-6',
        'time-6h',
        'time-7',
        'time-7h',
        'time-8',
        'time-8h',
        'time-9',
        'time-9h',
        'time-10',
        'time-10h',
        'time-11',
        'time-11h',
        'time-12',
        'time-12h',
        'time-13',
        'time-13h',
        'time-14',
        'time-14h',
        'time-15',
        'time-15h',
        'time-16',
        'time-16h',
        'time-17',
        'time-17h',
        'time-18',
        'time-18h',
        'time-19',
        'time-19h',
        'time-20',
        'time-20h',
        'time-21',
        'time-21h',
        'time-22',
        'time-22h',
        'time-23',
        'time-23h'
    ];
    
    function calcSummary() {
        $scope.summary = [];
        $scope.taskSummary = [];
        angular.forEach($scope.day.tasks, function(t) { $scope.taskSummary.push(0); });
        var dayTot = 0;
        Utils.forRange(0, 24*2-1, function(i) {
            var hourTot = 0;
            angular.forEach($scope.day.tasks, function(t,tIdx) {
                    hourTot += t.marks[i];
                    $scope.taskSummary[tIdx] += t.marks[i]/4;
                }
            );
            $scope.summary.push(hourTot);
            dayTot += hourTot;
        });
        $scope.day.total = dayTot/4;
    }
    calcSummary();
    
    $scope.changeMark = function(taskIdx,hourIdx) {
        var task = $scope.day.tasks[taskIdx],
            oldV = task.marks[hourIdx],
            newV = (oldV===0) ? 2 : oldV-1;
        task.marks[hourIdx] = newV;
        $scope.summary[hourIdx] += newV - oldV;
        $scope.taskSummary[taskIdx] += (newV - oldV)/4;
        $scope.day.total += (newV - oldV)/4;
    };

    $scope.removeTask = function(idx) {
        $scope.day.tasks.splice(idx,1);
        calcSummary();
    };
    
    $scope.addTask = function() {
        var newMarks = [ ],
            newTask = { task: '', marks: newMarks };
        for (var i = 0 ; i < 24*2 ; i++) {
            newMarks.push(0);
        }
        $scope.day.tasks.push( newTask );
        $scope.taskSummary.push(0);
    };
}
);
