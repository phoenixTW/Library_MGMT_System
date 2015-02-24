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
					{ id: "12346", book_name: 'Javascript Reference', available: 0, takenBy: "1" } ])
				done();
			});
		});
	});

	describe("#borrowBook", function(){
		it("should update the availabilty of book to 0 and add the userId", function(done){
			lms_records.borrowBook(["12345","1"], function(err, book){
				assert.notOk(err);
				assert.equal(book.book_name , "JAVA");
				lms_records.getSearchedBooks('JAVA', function(err, books){
					assert.deepEqual(books,[ { id: "12345", book_name: 'JAVA', available: 0, takenBy: "1" },
						{ id: "12346", book_name: 'Javascript Reference', available: 0, takenBy: "1" } ]);
					done();
				});
			});
		});
	

		it("should insert the new record in lendings with taken date and put null in return date", function(done){
			lms_records.borrowBook(["12345","1"], function(err, book){
				assert.notOk(err);
				assert.equal(book.book_name , "JAVA");
				lms_records.getLendingsOfBookIdNOtReturned("12345",function(er,book){
					assert.equal(book.len_id,3);
					assert.equal(book.book_id, "12345");
					assert.equal(book.user_id, 1);
					done();
				});
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

	describe("#returnBook", function(){
		it("should update available status to 1 and takenBy to null", function(done){
			lms_records.borrowBook(["12345","1"],function(err,book){});
			lms_records.returnBook("12345",function(err,bookDetails){
				assert.notOk(err);
				assert.deepEqual(bookDetails, {book_name:'JAVA'});
				lms_records.getSearchedBooks('JAVA', function(err, books){
					assert.deepEqual(books,[ { id: "12345", book_name: 'JAVA', available: 1, takenBy: "null"  },
						{ id: "12346", book_name: 'Javascript Reference', available: 0, takenBy: "1" } ]);
					done();
				});
			});
		});

		it("should update return_date in lending table where the bookId is present and return date is null", function(done){
			lms_records.borrowBook(["12345","1"],function(err,book){});
			lms_records.returnBook("12345",function(err,bookDetails){
				assert.notOk(err);
				lms_records.getLendingsOfBookIdNOtReturned("12345",function(er,book){
					assert.notOk(book);
					done();
				});
			});
		});		
	});

});
