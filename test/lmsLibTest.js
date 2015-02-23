var lib = require('../Src/lmsLib');
var assert = require('chai').assert;

describe('lms_lib',function(){

	describe('#countBooks',function(done){
		it('should return [{name: "java", count :1}] for input [{"book_name":"java"}]',function(done){
			expected = 	[{name: "java", count :1}];
			assert.deepEqual(lib.countBooks([{"book_name":"java"}]),expected);
			done();
		});

		it('should return [{name: "java", count:2}] for input [{"book_name":"java"}, {"book_name":"java"}]',function(done){
			expected = 	[{name: "java", count:2}];
			assert.deepEqual(lib.countBooks([{"book_name":"java"}, {"book_name":"java"}]),expected);
			done();
		});

		it('should return [{name: "java", count:2},{name: "javar", count:1}] for input [{"book_name":"java"}, {"book_name":"java"}, {"book_name":"javar"}]',function(done){
			expected = 	[{name: "java", count:2},{name: "javar", count:1}];
			assert.deepEqual(lib.countBooks([{"book_name":"java"}, {"book_name":"java"}, {"book_name":"javar"}]),expected);
			done();
		});

		it('should return [{name: "java", count:2},{name: "SQL", count:2}] for input [{"book_name":"java"}, {"book_name":"java"}, {"book_name":"SQL"}, {"book_name":"SQL"}]',function(done){
			expected = 	[{name: "java", count:2},{name: "SQL", count:2}];
			assert.deepEqual(lib.countBooks([{"book_name":"java"}, {"book_name":"java"}, {"book_name":"SQL"}, {"book_name":"SQL"}]),expected);
			done();
		});
	});
});