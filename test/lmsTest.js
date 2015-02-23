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

	describe('queryParser', function () {
		describe('#selectQueryMaker', function() {
			it('should return select * from tableName if no data is given', function () {
				var expectedQuery = 'select * from tableName;';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName'), expectedQuery);
			});

			it('should return select field from tableName if field is given as select object', function () {
				var expectedQuery = 'select field from tableName;';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field']), expectedQuery);
			});

			it('should return select field from tableName where email = "kaustav.ron@gmail.com" if field is given as select object', function () {
				var expectedQuery = 'select field from tableName where email = "kaustav.ron@gmail.com";';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field'], {email: 'kaustav.ron@gmail.com'}), expectedQuery);
			});

			it('should return select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty" if field is given as select object', function () {
				var expectedQuery = 'select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty";';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field1', 'field2'], {
					email: 'kaustav.ron@gmail.com',
					name: 'Kaustav Chakraborty'
				}), expectedQuery);
			});
		});

		describe('#insertQueryMaker', function() {
			it('should return insert into tableName values ("value1", "value2") if no data is given', function () {
				var expectedQuery = 'insert into tableName values("value1", "value2");';
				assert.deepEqual(lib.queryParser.insertQueryMaker('tableName', ['value1', 'value2']), expectedQuery);
			});

			it('should return insert into (field1, field2) tableName values ("value1", "value2") if field is given as select object', function () {
				var expectedQuery = 'insert into tableName (field1, field2) values("value1", "value2");';
				assert.deepEqual(lib.queryParser.insertQueryMaker('tableName', ['value1', 'value2'], ['field1', 'field2']), expectedQuery);
			});
		});
	});

});
