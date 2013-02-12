'use strict';
/*global angular:false, document:false */

/* App Controllers */

angular.module(
    'ExportControllers', ['Utils','Storage','Notification','TableExport']
).controller('ExportCtrl', ['$scope','Utils','Storage','TableExport', function AppCtrl($scope,Utils,Storage,TableExport) {

    function createCSV() {
        var tasksExporter, daysExporter, weeksExporter;
        if ($scope.settings.exportWhat === 'tasks') {
            tasksExporter = TableExport.csvExporter();
            tasksExporter.addColumns("date","task","hours","start");
        }
        if ($scope.settings.exportWhat === 'days') {
            daysExporter = TableExport.csvExporter();
            daysExporter.addColumns("date","comment","hours");
        }
        if ($scope.settings.exportWhat === 'weeks') {
            weeksExporter = TableExport.csvExporter();
            weeksExporter.addColumns("year","weeknum","date","hours");
        }

        var weekInProgress;
        function addWeekInProgress() {
            weeksExporter.addRow(
                weekInProgress.date.year,
                weekInProgress.date.weekNumber(),
                weekInProgress.date.format("dd-MM-yyyy"),
                weekInProgress.hours
            );
        }

        Storage.forAllDaysInOrder(
            function (date,day) {
                var dateForCsv = date.format("dd-MM-yyyy");
                if (tasksExporter) {
                    angular.forEach(day.tasks,
                        function (task) {
                            var markTotal = 0;
                            angular.forEach(task.marks, function (v) {
                                markTotal += v;
                            });
                            tasksExporter.addRow(dateForCsv,task.task,markTotal/4);
                        }
                    );
                }
                if (daysExporter) {
                    daysExporter.addRow(dateForCsv,day.comment,day.total);
                }
                if (weeksExporter) {
                    var startOfWeek = date.startOfWeek();
                    if (!weekInProgress) {
                        weekInProgress = {date: startOfWeek, hours:day.total};
                    } else if (weekInProgress.date.equals(startOfWeek)) {
                        weekInProgress.hours += day.total;
                    } else {
                        addWeekInProgress();
                        weekInProgress = {date: startOfWeek, hours:day.total};
                    }
                }
            }
        );
        if (weekInProgress) {
            addWeekInProgress();
        }

        var out = '';
        if (tasksExporter) {
            out = out + tasksExporter.toString();
        }
        if (daysExporter) {
            out = out + daysExporter.toString();
        }
        if (weeksExporter) {
            out = out + weeksExporter.toString();
        }
        return out;
    }

    $scope.debugExport = function() {
        $scope.debugExport = $scope.makeDownload();
    };

    $scope.makeDownload = function () {
        return {
            data: createCSV(),
            filename: 'timetracker.csv',
            mimeType: 'text/csv'
        };
    };

/*
    $scope.doDownload = function() {
        var txt = createCSV();

        //See: https://developer.mozilla.org/en-US/docs/data_URIs
        //document.location = "data:text/csv;charset=UTF8;filename=\"fred.csv\","+encodeURIComponent(txt);

        //See: http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server        
        // window.location.href = URL.createObjectURL(new Blob([txt], {type: 'text/csv'}));

        //See: http://stackoverflow.com/questions/7160720/create-a-file-using-javascript-in-chrome-on-client-side

        var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        function err(e) {
            console.log('Error', e); 
        }

        requestFileSystem(window.TEMPORARY, 1024, function(fs) {
            fs.root.getFile('timetracker.csv', {create: true}, function(fileEntry) { // test.bin is filename
                fileEntry.createWriter(function(fileWriter) {
            
                    var blob = new Blob([txt], {type: 'text/csv'});

                    fileWriter.addEventListener("writeend", function() {
                        // navigate to file, will download
                        window.location.href = fileEntry.toURL();
                    }, false);

                    fileWriter.write(blob);
                }, err);
            }, err);
        }, err);

        // See also http://eligrey.com/demos/FileSaver.js/
    };
*/
}

]).directive('downloadDataAsFile', function DownloadDataAsFile() {
    // There's a bug on FireFox for Mac for this (adds a '.part' to filename):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=622400
    return function(scope, element, attrs) {
        element.attr('href','#'); // need to set or first click will do nothing
        element.attr('download','');
        element.bind('click', function (evt) {
            var pkg = scope.$eval(attrs.downloadDataAsFile);
            //var url = "data:"+pkg.mimeType+";charset=UTF8;filename=\""+pkg.filename+"\","+encodeURIComponent(pkg.data);
            var url = "data:"+pkg.mimeType+";charset=utf-8,"+encodeURIComponent(pkg.data);
            element.attr('href',url);
            element.attr('download',pkg.filename);
            element.attr('title',pkg.filename);
            // evt will now do default action of downloading the file from the a tag
        });
    };
});
