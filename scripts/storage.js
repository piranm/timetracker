'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'Storage', ['Utils']
).service('Storage', function (Utils) {

    var localStorage = window.localStorage;

    var keyPrefix = 'TimeTracker:';
    function retrieveJson(k) {
        return angular.fromJson(localStorage.getItem(keyPrefix+k));
    }
    function storeJson(k,v) {
        localStorage.setItem(keyPrefix+k,angular.toJson(v));
    }

    return {
        getDayRecord: function (date) {
            var dayRecord = retrieveJson(date.format('yyyy-MM-dd'));
            if (dayRecord === null) {
                dayRecord = {
                    comment: '',
                    total: 0.0,
                    tasks: [
                        {
                            task: '',
                            marks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                };
            }
            return dayRecord;
        },

        setDayRecord: function (date,dayRecord) {
            storeJson(date.format('yyyy-MM-dd'), dayRecord);
        },

        getSettings: function () {
            var settings = retrieveJson('settings');
            if (settings === null) {
                return {};
            }
            return settings;
        },

        setSettings: function (settings) {
            storeJson('settings', settings);
        },

        forAllDaysInOrder: function (iter) {
            var len = localStorage.length;
            var filter = new RegExp('^'+keyPrefix+'(\\d{4})-(\\d{2})-(\\d{2})$');
            var keys = [];
            for (var i = 0 ; i < len ; i++) {
                var k = localStorage.key(i);
                if (k.match(filter)) {
                    keys.push(k);
                }
            }
            keys = keys.sort();

            angular.forEach(keys, function (k) {
                var parts = k.match(filter);
                var date = new Utils.SimpleDate(parseInt(parts[3],10),parseInt(parts[2],10),parseInt(parts[1],10));
                var dayStorage = angular.fromJson(localStorage.getItem(k));
                iter(date,dayStorage);
            });
        },

        clear: function () {
            localStorage.clear();
        }
    };
});
