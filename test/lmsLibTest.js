var lib = require('../Src/lmsLib');
var assert = require('chai').assert;

describe('lms_lib',function(){

	describe('#countBooks',function(done){
		it('should return [{name: "java", count :1, available: 1}] for input [{"book_name":"java"}]',function(done){
			expected = 	[{name: "java", count :1, available: 1}];
			assert.deepEqual(lib.countBooks([{"book_name":"java", available: 1}]),expected);
			done();
		});

		it('should return [{name: "java", count:2, available: 2}] for input [{"book_name":"java", available: 1}, {"book_name":"java", available: 1}]',function(done){
			expected = 	[{name: "java", count:2, available: 2}];
			assert.deepEqual(lib.countBooks([{"book_name":"java", available: 1}, {"book_name":"java", available: 1}]),expected);
			done();
		});

		it('should return [{name: "java", count:2, available: 1},{name: "javar", count:1, available: 1}] for input [{"book_name":"java", available: 1}, {"book_name":"java", available: 0}, {"book_name":"javar", available: 1}]',function(done){
			expected = 	[{name: "java", count:2, available: 1},{name: "javar", count:1, available: 1}];
			assert.deepEqual(lib.countBooks([{"book_name":"java", available: 1}, {"book_name":"java", available: 0}, {"book_name":"javar", available: 1}]),expected);
			done();
		});

		it('should return [{name: "java", count:2, available: 0},{name: "SQL", count:2, available: 2}] for input [{"book_name":"java", available: 0}, {"book_name":"java", available: 0}, {"book_name":"SQL", available: 1}, {"book_name":"SQL", available:1}]',function(done){
			expected = 	[{name: "java", count:2, available: 0},{name: "SQL", count:2, available: 2}];
			assert.deepEqual(lib.countBooks([{"book_name":"java", available: 0}, {"book_name":"java", available: 0}, {"book_name":"SQL", available: 1}, {"book_name":"SQL", available:1}]),expected);
			done();
		});
	});
});