var lib = require('../Src/lmsLib');
var assert = require('chai').assert;

describe('lms_lib',function(){

	describe('#countBooks',function(done){
		it('should return {"java":1} for input ["java"]',function(done){
			expected = 	{"java":1};
			assert.deepEqual(lib.countBooks(['java']),expected);
			done();
		});
	});

	describe('#countBooks',function(done){
		it('should return {"java":2} for input ["java","java"]',function(done){
			expected = 	{"java":2};
			assert.deepEqual(lib.countBooks(["java","java"]),expected);
			done();
		});
	});
});