'use strict';
/*global angular:false, document:false */

/* App Controllers */

angular.module(
    'ExportControllers', ['Utils','Storage','Notification','TableExport']
).controller('ExportCtrl', function AppCtrl($scope,Utils,Storage,TableExport) {

    $scope.doExport = function() {
        var tableExporter = TableExport.csvExporter();

        tableExporter.addColumns("date","task","hours","start");
        Storage.forAllDaysInOrder(
            function (date,day) {
                angular.forEach(day.tasks,
                    function (task) {
                        var markTotal = 0;
                        angular.forEach(task.marks, function (v) {
                            markTotal += v;
                        });
                        tableExporter.addRow(date.format("dd-MM-yyyy"),task.task,markTotal/4);
                    }
                );
            }
        );

        $scope.exportOutput = tableExporter.toString();
    };

});
