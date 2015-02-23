var lib = require('../Src/lmsLib');
var assert = require('chai').assert;

describe('lms_lib',function(){

	describe('#countBooks',function(done){
		it('should return {"java":1} for input [{"book_name":"java"}]',function(done){
			expected = 	{"java":1};
			assert.deepEqual(lib.countBooks([{"book_name":"java"}]),expected);
			done();
		});
	});

	describe('#countBooks',function(done){
		it('should return {"java":2} for input [{"book_name":"java"}, {"book_name":"java"}]',function(done){
			expected = 	{"java":2};
			assert.deepEqual(lib.countBooks([{"book_name":"java"}, {"book_name":"java"}]),expected);
			done();
		});
	});
});