'use strict';

/* Main Controllers */

angular.module(
    'DayControllers', ['Utils']
).controller('DayCtrl', function DayCtrl($scope) {
    $scope.date = '17-Jan-2013';
    $scope.open = true;
    $scope.day = {
        comment: '',
        total: 8,
        tasks: [
            {
                task: 'first task',
                marks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                task: 'second task',
                marks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        ]
    };
}
).controller('DayEditorCtrl', function DayEditorCtrl($scope, Utils) {
    $scope.dayOfWeek = 'Thursday';
    $scope.hourStart = 8;
    $scope.showRange = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
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
    
    $scope.calcSummary = function () {
        $scope.summary = [];
        var dayTot = 0;
        Utils.forRange(0, 24*2-1, function(i) {
          var hourTot = 0;
          angular.forEach($scope.day.tasks, function(t) {
                    hourTot += t.marks[i];
                }
            );
            $scope.summary.push(hourTot);
            dayTot += hourTot;
        });
        $scope.day.total = dayTot/4;
    };
    $scope.calcSummary();
    
    $scope.changeMark = function(task,idx,$event) {
        var oldV = task.marks[idx],
            newV = (oldV===0) ? 2 : oldV-1;
        task.marks[idx] = newV;
        $scope.summary[idx] += newV - oldV;
        $scope.day.total += (newV - oldV)/4;
    };

  $scope.addBefore = function() {
        var newHour = $scope.hourRange[0]-1;
        $scope.hourRange.unshift(newHour);
        angular.forEach($scope.tasks, function(t) {
                t.marks.splice(0,0,0,0); // add two zeros to beginning
            }
        );
        $scope.calcSummary();
    };

    $scope.addAfter = function() {
        var newHour = $scope.hourRange[$scope.hourRange.length - 1]+1;
        $scope.hourRange.push(newHour);
        angular.forEach($scope.tasks, function(t) {
                t.marks.splice(t.marks.length,0,0,0); // add two zeros to the end
            }
        );
        $scope.calcSummary();
    };

    $scope.removeTask = function(idx) {
        $scope.day.tasks.splice(idx,1);
        $scope.calcSummary();
    };
    
    $scope.addTask = function() {
        var newMarks = [ ],
            newTask = { task: '', marks: newMarks };
        for (var i = 0 ; i < 24*2 ; i++) {
            newMarks.push(0);
        }
        $scope.day.tasks.push( newTask );
    };
}
);
