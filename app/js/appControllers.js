'use strict';

/* App Controllers */

angular.module(
    'AppControllers', ['Utils']
).controller('AppCtrl', function AppCtrl($scope) {

    $scope.settings = {
        name: 'Time Tracker',
        timeFormat: '24hr',
        workStart: 9.0,
        workEnd: 17.5,
        showStart: 8,
        showEnd: 19
    };

    $scope.changeSettings = function() {
        var workClasses = '';
        for (var h = $scope.settings.workStart ; h < $scope.settings.workEnd ; h += 0.5 ) {
            var baseHour = Math.floor(h);
            workClasses = workClasses + 'work-'+baseHour+(baseHour !== h ? 'h':'')+' ';
        }
        document.getElementById('workHoursContainer').setAttribute('class',workClasses);
    };
    $scope.$watch('settings', $scope.changeSettings, angular.equals);

}).controller('TopNavCtrl', function TopNavCtrl($scope) {
    $scope.showInDropdown = '';
    $scope.showDropdown = function(item) {
        if (item === $scope.showInDropdown) {
            $scope.showInDropdown = '';
        } else {
            $scope.showInDropdown = item;
        }
    };
});
