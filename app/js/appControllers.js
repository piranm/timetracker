'use strict';
/*global angular:false, document:false */

/* App Controllers */

angular.module(
    'AppControllers', ['Utils']
).controller('AppCtrl', function AppCtrl($scope,Utils) {

    $scope.settings = {
        name: 'Time Tracker',
        timeFormat: '24hr',
        workStart: 9.0,
        workEnd: 17.5,
        showStart: 8,
        showEnd: 19
    };

    function changeSettings() {
        var workClasses = '';
        for (var h = $scope.settings.workStart ; h < $scope.settings.workEnd ; h += 0.5 ) {
            var baseHour = Math.floor(h);
            workClasses = workClasses + 'work-'+baseHour+(baseHour !== h ? 'h':'')+' ';
        }
        document.getElementById('workHoursContainer').setAttribute('class',workClasses);
    }
    $scope.$watch('settings', changeSettings, angular.equals);

    var today = Utils.SimpleDate.fromJsDate(new Date());
    var weekStartDelta = today.dayOfWeek()-1;
    if (weekStartDelta < 0 ) {
        weekStartDelta += 7;
    }
    var startOfThisWeek = today.addDays(-weekStartDelta);
    $scope.weeks = [{start: startOfThisWeek, numDays: 7}];

}).controller('TopNavCtrl', function TopNavCtrl($scope) {
    $scope.showInDropdown = '';
    $scope.showDropdown = function(item) {
        if (item === $scope.showInDropdown) {
            $scope.showInDropdown = '';
        } else {
            $scope.showInDropdown = item;
        }
    };
}).controller('WeekCtrl', function WeekCtrl($scope, Utils) {
    $scope.days = [];
    for (var d = 0 ; d < 7 ; d++) {
        var dayDate = $scope.startOfWeek.addDays(d);
        $scope.days.push( {dayDate: dayDate, dayOpen: dayDate.isToday() });
    }
    $scope.endOfWeek = $scope.days[$scope.days.length-1].dayDate;
    $scope.weekNumber = $scope.startOfWeek.weekNumber();
});
