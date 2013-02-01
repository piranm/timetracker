'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'Storage', ['Utils']
).service('Storage', function () {

    var localStorage = window.localStorage;

    return {
        getDayRecord: function (date) {
            var dayRecord = localStorage.getItem(date.format('yyyy-MM-dd'));
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
            } else {
                dayRecord = angular.fromJson(dayRecord);
            }
            return dayRecord;
        },

        setDayRecord: function (date,dayRecord) {
            localStorage.setItem(date.format('yyyy-MM-dd'), angular.toJson(dayRecord));
        },

        clear: function () {
            localStorage.clear();
        }
    };
});
