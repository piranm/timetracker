'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'Storage', ['Utils']
).service('Storage', function () {

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

        clear: function () {
            localStorage.clear();
        }
    };
});
