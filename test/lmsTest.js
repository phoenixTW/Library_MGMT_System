var lib = require('../Src/lmsModule');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('./test/data/lms.db.backup');

var lms_records;

describe('lms_records',function(){
	beforeEach(function(){
		fs.writeFileSync('test/data/lms.db',dbFileData);
		lms_records = lib.init('test/data/lms.db');
	});

	describe('#getSearchedTopics',function(){
		it('getSearchedTopics gives the all related books which is searched',function(done){
			expected = "JAVA";
			lms_records.getSearchedBooks('JAVA',function(err,topics){
				assert.notOk(err);
				assert.deepEqual(topics[0].book_name,expected);
				done();
			});
		});
	});

});
