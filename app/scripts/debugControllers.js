'use strict';

/* Main Controllers */
/*global angular:false */

angular.module(
    'DebugControllers', ['Storage','Utils']
).controller('DebugCtrl', function DebugCtrl($scope, Storage) {
    $scope.debugDay    = $scope.today.format("dd");
    $scope.debugMonth  = $scope.today.format("MM");
    $scope.debugYear   = $scope.today.format("yyyy");
    $scope.debugHour   = "10";
    $scope.debugMinute = "00";

    $scope.debugTick = function () {
        $scope.halfHourAction(new Date(parseInt($scope.debugYear,10),parseInt($scope.debugMonth,10)-1,parseInt($scope.debugDay,10),parseInt($scope.debugHour,10),parseInt($scope.debugMinute,10),0));
    };

    $scope.debugClearStorage = function () {
        Storage.clear();
    };
}
);