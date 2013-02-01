'use strict';
/*global angular:false, document:false */

/* App Controllers */

angular.module(
    'AppControllers', ['Utils','Storage']
).controller('AppCtrl', function AppCtrl($scope,Utils,Storage, $timeout) {

    $scope.settings = {
        name: 'Time Tracker',
        timeFormat: '24hr',
        workStart: 9.0,
        workEnd: 17.5,
        showStart: 8,
        showEnd: 19
    };
    angular.extend($scope.settings, Storage.getSettings());

    function changeSettings(newValue) {
        Storage.setSettings(newValue);

        var workClasses = '';
        for (var h = $scope.settings.workStart ; h < $scope.settings.workEnd ; h += 0.5 ) {
            var baseHour = Math.floor(h);
            workClasses = workClasses + 'work-'+baseHour+(baseHour !== h ? 'h':'')+' ';
        }
        document.getElementById('workHoursContainer').setAttribute('class',workClasses);
    }
    $scope.$watch('settings', changeSettings, angular.equals);

    $scope.today = $scope.today || Utils.SimpleDate.fromJsDate(new Date()); // allow debug injection of date
    var weekStartDelta = $scope.today.dayOfWeek()-1;
    if (weekStartDelta < 0 ) {
        weekStartDelta += 7;
    }
    var startOfThisWeek = $scope.today.addDays(-weekStartDelta);
    $scope.weeks = [{start: startOfThisWeek}];

    $scope.showPreviousWeek = function () {
        var weekStart = $scope.weeks[0].start.addDays(-7);
        $scope.weeks.unshift( {start:weekStart} );
    };

    $scope.showPreviousMonth = function () {
        var currentStart = $scope.weeks[0].start;
        if (currentStart.day === 1) {
            currentStart = currentStart.addDays(-1);
        }
        var startOfMonth = currentStart.addDays(-currentStart.day+1);
        var weekStart = $scope.weeks[0].start;
        while (weekStart.after(startOfMonth)) {
            weekStart = weekStart.addDays(-7);
            $scope.weeks.unshift( {start:weekStart} );
        }
    };

    $scope.hideExtraWeeks = function () {
        $scope.weeks.splice(0,$scope.weeks.length-1);
    };

    function higlightCurrentHour() {
        var now = new Date();
        var nowClass = 'now-'+now.getHours()+(now.getMinutes() >= 30 ? 'h':'');
        var currentTimeContainer = document.getElementById('currentTimeContainer');
        if (currentTimeContainer) {
            currentTimeContainer.setAttribute('class',nowClass);
        }
    }
    var halfHourTimeout;
    function waitForHalfHour() {
        var now = new Date();
        var minutes = now.getMinutes() % 30;
        var seconds = (60 - now.getSeconds()) + 60*(30 - minutes - 1);
        halfHourTimeout = $timeout(halfHourAction, seconds*1000, false);
    }
    function halfHourAction() {
        higlightCurrentHour();
        waitForHalfHour();
    }
    $scope.$on('$destroy', function () { $timeout.cancel(halfHourTimeout); });
    waitForHalfHour();
    higlightCurrentHour();
    
}).controller('TopNavCtrl', function TopNavCtrl($scope) {
    $scope.showInDropdown = '';
    $scope.showDropdown = function(item, $event) {
        if (item === $scope.showInDropdown) {
            $scope.showInDropdown = '';
        } else {
            $scope.showInDropdown = item;
        }
        $event.stopPropagation();
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
