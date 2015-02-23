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
				assert.deepEqual(topics, [ { id: 12345, book_name: 'JAVA', available: 1, takenBy: null },
					{ id: 12346, book_name: 'Javascript Reference', available: 0, takenBy: 1 } ])
				done();
			});
		});
	});

	describe("#borrowBook", function(){
		it("should update the availabilty of book to 0 and add the userId", function(done){
			lms_records.borrowBook([12345,1], function(err, book){
				assert.notOk(err);
				assert.equal(book.book_name , "JAVA");
				lms_records.getSearchedBooks('JAVA', function(err, books){
					assert.deepEqual(books,[ { id: 12345, book_name: 'JAVA', available: 0, takenBy: 1 },
						{ id: 12346, book_name: 'Javascript Reference', available: 0, takenBy: 1 } ]);
					done();
				});
			});
		});


		it("should insert the new record in lendings with taken date and put null in return date", function(done){
			lms_records.borrowBook([12345,1], function(err, book){
				assert.notOk(err);
				assert.equal(book.book_name , "JAVA");
				lms_records.getLendingsOfBookIdNOtReturned(12345,function(er,book){
					assert.equal(book.len_id,3);
					assert.equal(book.book_id, 12345);
					assert.equal(book.user_id, 1);
					done();
				})
			});
		});
	});

});
