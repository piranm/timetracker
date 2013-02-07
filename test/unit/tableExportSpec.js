'use strict';
/*global describe:false, beforeEach:false, it:false, expect:false */
/*global module:false, inject:false */

/* jasmine specs for filters go here */

describe('TableExport', function() {
	var EOL = "\r\n";
	
	beforeEach(module('TableExport'));

	it("export columns", inject(function(TableExport) {
		var te = TableExport.csvExporter();
		te.addColumns("col1","col2","col3");
		expect(te.toString()).toEqual('"col1","col2","col3"'+EOL);
	}));
	
	it("export data", inject(function(TableExport) {
		var te = TableExport.csvExporter();
		te.addRow("col1","col2","col3");
		expect(te.toString()).toEqual('"col1","col2","col3"'+EOL);
	}));
	
	it("escape quotes and commas", inject(function(TableExport) {
		var te = TableExport.csvExporter();
		te.addRow('"col1","col2","col3"');
		expect(te.toString()).toEqual('"""col1"",""col2"",""col3"""'+EOL);
	}));
	
	it("should export numbers correctly", inject(function(TableExport) {
		var te = TableExport.csvExporter();
		te.addRow("col1",0,1.5,"col3");
		expect(te.toString()).toEqual('"col1",0,1.5,"col3"'+EOL);
	}));
	
	it("should export numbers correctly", inject(function(TableExport) {
		var te = TableExport.csvExporter();
		te.addRow("col1",undefined,"col3");
		expect(te.toString()).toEqual('"col1",,"col3"'+EOL);
	}));
	
});
