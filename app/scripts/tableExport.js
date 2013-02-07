'use strict';
/*global angular:false, document:false */

/* Settings Controllers */

angular.module(
    'TableExport', ['Utils']
).service('TableExport', function (Utils) {
    var EOF = "\r\n";
    function csvSafe(s) {
        switch (typeof s) {
            case 'undefined':
                return '';
            case 'number':
                return s.toString();
            default:
                return '"' + s.toString().replace(/"/g,'""') + '"';
        }
    }

    function TableExport() {
        this.data = '';
    }
    TableExport.prototype.addColumns = function () {
        var len = arguments.length;
        for (var i = 0 ; i < len ; i++) {
            this.data = this.data + (i === 0 ? '' : ',') + csvSafe(arguments[i]);
        }
        this.data = this.data + EOF;
    };
    TableExport.prototype.addRow = TableExport.prototype.addColumns;
    TableExport.prototype.toString = function () {
        return this.data;
    };

    return {
        csvExporter: function () {
            return new TableExport();
        }
    };
});
