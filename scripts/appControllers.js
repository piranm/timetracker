'use strict';
/*global angular:false, document:false */

/* App Controllers */

angular.module(
    'AppControllers', ['Utils','Storage','Notification']
).controller('AppCtrl', function AppCtrl($scope,Utils,Storage,$timeout,Notification,$location) {

    $scope.settings = {
        name: 'Time Tracker',
        timeFormat: '24hr',
        workStart: 9.0,
        workEnd: 17.5,
        showStart: 8,
        showEnd: 19,
        notificationEnabled: false,
        notificationFrequency: 30,
        notificationWorkHoursOnly: false,
        exportWhat: 'tasks',
        exportFormat: 'csv'
    };
    angular.extend($scope.settings, Storage.getSettings());

    function changeSettings(newValue) {
        Storage.setSettings(newValue);

        var workClasses = '';
        for (var h = $scope.settings.workStart ; h < $scope.settings.workEnd ; h += 0.5 ) {
            var baseHour = Math.floor(h);
            workClasses = workClasses + 'work-'+baseHour+(baseHour !== h ? 'h':'')+' ';
        }
        var workHoursContainer = document.getElementById('workHoursContainer');
        if (workHoursContainer) {
            workHoursContainer.setAttribute('class',workClasses);
        }
    }
    $scope.$watch('settings', changeSettings, true);

    var nowDate = new Date();
    var debugToday = $location.search().debugToday;
    if (debugToday) {
        $scope.debug = true;
        nowDate.setDate(parseInt(debugToday.substring(0,2),10));
        nowDate.setMonth(parseInt(debugToday.substring(2,4),10)-1);
        nowDate.setFullYear(parseInt(debugToday.substring(4,8),10));
    }

    if ($scope.today) {
        // allow debug injection of date
        nowDate = $scope.today.toJsDate();
    } else {
        $scope.today = Utils.SimpleDate.fromJsDate(nowDate);
    }

    var startOfThisWeek = $scope.today.startOfWeek();
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

    function halfHourAction(debugTime) {
        var now = debugTime || new Date();
        higlightCurrentTime(now);
        showNotification(now);
        showCurrentDay(now);
        waitForHalfHour(now);
    }
    function showCurrentDay(now) {
        var nowDate = Utils.SimpleDate.fromJsDate(now);
        var nextWeekDate = $scope.weeks[$scope.weeks.length-1].start.addDays(7);
        while (!nextWeekDate.after(nowDate)) {
            $scope.weeks.push({start:nextWeekDate});
            nextWeekDate = nextWeekDate.addDays(7);
        }
        if (!$scope.today.equals(nowDate)) {
            $scope.today = nowDate;
            $timeout(function() {$scope.$broadcast('showDate', $scope.today);}, 1, true);
        }
    }
    function higlightCurrentTime(now) {
        var nowClass = 'now-'+now.getHours()+(now.getMinutes() >= 30 ? 'h':'');
        var currentTimeContainer = document.getElementById('currentTimeContainer');
        if (currentTimeContainer) {
            currentTimeContainer.setAttribute('class',nowClass);
        }
    }
    var tickTimeout;
    function waitForHalfHour(now) {
        if ($scope.debug) { return; }
        var minutes = now.getMinutes() % 30;
        var seconds = (60 - now.getSeconds()) + 60*(30 - minutes - 1);
        tickTimeout = window.setTimeout(halfHourAction, seconds*1000);
    }
    $scope.$on('$destroy', function () { window.cancelTimeout(tickTimeout); });

    function notificationClick(evt) {
        window.focus();
        $timeout(function() {$scope.$broadcast('showDate', $scope.today);}, 1, true);
        evt.srcElement.cancel();
    }
    function showNotification(now) {
        if ($scope.settings.notificationEnabled) {
            if ($scope.settings.notificationWorkHoursOnly && !isInWorkHours(now)) {
                return;
            }

            if ((now.getMinutes() % $scope.settings.notificationFrequency) === 0) {
                var todayRecord = Storage.getDayRecord($scope.today);
                var msg = makeNotificationMessage(todayRecord, now);
                if (angular.isDefined(msg)) {
                    Notification.show('Time Tracker', msg, 'img/favicon.png', 'timetracker', notificationClick, undefined);
                }
            }
        }
    }
    function makeNotificationMessage(dayRecord, now) {
        function findLastMark(dayRecord) {
            for (var i = 47 ; i >= 0 ; i--) {
                for (var j = dayRecord.tasks.length-1 ; j >= 0 ; j--) {
                    if ( dayRecord.tasks[j].marks[i] !== 0) {
                        return i;
                    }
                }
            }
            return -1;
        }

        var lastMark = findLastMark(dayRecord);
        var currMark = now.getHours()*2 + (now.getMinutes() < 30 ? 0 : 1)-1;
        if (lastMark === -1) {
            return "You've not filled in your time today.";
        } else if (lastMark >= currMark) {
            return undefined; // nothing to say
        } else if (lastMark === currMark-1) {
            return "You're half-an-hour behind.";
        } else if (lastMark === currMark-2) {
            return "You're one hour behind.";
        } else {
            return "You're "+(currMark - lastMark)/2+"hrs behind.";
        }
    }
    $scope.makeNotificationMessage = makeNotificationMessage; // for testing

    function isInWorkHours(now) {
        var nowTime = now.getHours() + (now.getMinutes() < 30 ? 0 : 0.5);
        return nowTime >= $scope.settings.workStart && nowTime <= $scope.settings.workEnd;
    }
    $scope.isInWorkHours = isInWorkHours; // for testing

    halfHourAction(nowDate);
    $scope.halfHourAction = halfHourAction;
    

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
        $scope.days.push( {dayDate: dayDate });
    }
    $scope.endOfWeek = $scope.days[$scope.days.length-1].dayDate;
    $scope.weekNumber = $scope.startOfWeek.weekNumber();
});
