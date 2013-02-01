'use strict';

/* Settings Controllers */

angular.module(
    'SettingsControllers', ['Utils']
).controller('SettingsCtrl', function SettingsCtrl($scope, Utils) {
    $scope.timeFormats =
        [
            { name: '24-hour (14:00)',
              format: '24hr'
            },
            { name: '12-hour (2:00)',
              format: '12hr'
            },
            { name: 'am or pm (2pm)',
              format: 'ampm'
            }
        ];
    $scope.timeStartRange  = [];
    $scope.timeFinishRange  = [];
    $scope.timeStartHalfRange  = [];
    $scope.timeFinishHalfRange  = [];

    Utils.forRange(0,23,function(idx) {
        $scope.timeStartRange.push(idx);
        $scope.timeFinishRange.push(idx+1);
        $scope.timeStartHalfRange.push(idx, idx+0.5);
        $scope.timeFinishHalfRange.push(idx+0.5, idx+1.0);
    });

});
