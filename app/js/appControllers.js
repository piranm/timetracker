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

    $scope.weeks = [{start: new Utils.SimpleDate(15,11,2013), numDays: 7}];

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
    $scope.days = [
            {dayDate: new Utils.SimpleDate(15,11,2013), dayOpen: false},
            {dayDate: new Utils.SimpleDate(16,11,2013), dayOpen: false},
            {dayDate: new Utils.SimpleDate(17,11,2013), dayOpen: false},
            {dayDate: new Utils.SimpleDate(18,11,2013), dayOpen: true},
            {dayDate: new Utils.SimpleDate(19,11,2013), dayOpen: false},
            {dayDate: new Utils.SimpleDate(20,11,2013), dayOpen: false},
            {dayDate: new Utils.SimpleDate(21,11,2013), dayOpen: false}
        ];
});
