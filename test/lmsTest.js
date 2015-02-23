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
		it('getSearchedTopics gives the all related books which book name is java',function(done){
			var expected = "JAVA";
			lms_records.getSearchedBooks('JAVA',function(err,topics){
				assert.notOk(err);
				assert.deepEqual(topics[0].book_name,expected);
				done();
			});
		});

		it('getSearchedTopics gives the all related books which is searched',function(done){
			lms_records.getSearchedBooks('JAVA',function(err,topics){
				assert.notOk(err);
				assert.deepEqual(topics, [ { id: "12345", book_name: 'JAVA', available: 1, takenBy: null },
					{ id: "12346", book_name: 'Javascript Reference', available: 0, takenBy: 1 } ])
				done();
			});
		});
	});

	describe('#addBook', function() {
		it('should add a book and make the availablity 1', function (done) {
			lms_records.addBook({name: "RAFA", id:"12247"}, function(err){
				assert.notOk(err);

				lms_records.getSearchedBooks('RAFA',function(err,topics){
					assert.notOk(err);
					assert.deepEqual(topics, [ { id: "12247", book_name: 'RAFA', available: 1, takenBy: null }]);
					done();
				});
			});
		});

		it('should give error when ID is duplicated', function (done) {
			lms_records.addBook({name: "RAFA", id:"12347"}, function(err){
				assert.ok(err);
				done();
			});
		});
	});

	describe('#getUserDetails', function () {
		it('should give password and user_type as U for 1', function (done) {
			lms_records.getUserDetails("1", function (error, u_data) {
				assert.notOk(error);
				assert.deepEqual(u_data.password, "11111");
				assert.deepEqual(u_data.user_type, "U");
				done();
			});
		});

		it('should give error for 32', function (done) {
			lms_records.getUserDetails("32", function (error, u_data) {
				assert.equal(u_data, undefined);
				done();
			});
		});
	});
});
