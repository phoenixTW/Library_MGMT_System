var sqlite3 = require("sqlite3").verbose();
var JsSql = require("./JsSql").JsSql;

var _getSearchedBooks = function(name,db,onComplete){
	var searchQry = new JsSql();
	searchQry.select();
	searchQry.from(["booksStatus"]);
	searchQry.where(["book_name like '%"+name+"%'"]);
	searchQry.ready(db,"all",onComplete);
	searchQry.fire();
}

var getBookNameOfId = function(bookId, db, onComplete) {
	var getBookNameQry = new JsSql();
	getBookNameQry.select("book_name");
	getBookNameQry.from("booksStatus");
	getBookNameQry.where(["id='"+bookId+"'"]);
	getBookNameQry.ready(db, "get", onComplete);
	getBookNameQry.fire();
}

var insertBorrowBookDetails = function(args, db, onComplete) {
	var insQry = new JsSql();
	var date = new Date();
	insQry.insertInto("lending").someFields(["book_id","user_id","taken_date","return_date"]);
	insQry.values([args[0], args[1], String(date).slice(0,21), null]);
	insQry.ready(db, "run", function(er){
		er || getBookNameOfId(args[0],db,onComplete);
	});
	insQry.fire();
}


var _borrowBook = function(args, db, onComplete){
	var borrowQry = new JsSql();
	borrowQry.update("booksStatus");
	borrowQry.set(["available", "takenBy"]).values([0, args[1]]);
	borrowQry.where(["id='"+args[0]+"'"]);
	borrowQry.ready(db, "run", function(err){
		err || insertBorrowBookDetails(args, db, onComplete);
	});
	borrowQry.fire();
}

var _getLendingsOfBookIdNOtReturned = function(id,db,onComplete){
	var lendingDetailsQry = new JsSql();
	lendingDetailsQry.select();
	lendingDetailsQry.from("lending");
	lendingDetailsQry.where(["book_id="+id , "return_date='null'"]).connectors(["AND"]);
	lendingDetailsQry.ready(db,"get",onComplete);
	lendingDetailsQry.fire();
}

var _addBook = function (data, db, onComplete) {
	var addQuery = new JsSql();
	addQuery.insertInto('booksStatus').someFields(['id', 'book_name', 'available']);
	addQuery.values([data.id, data.name, 1]);
	addQuery.ready(db, "run", onComplete);
	addQuery.fire();
};

var _getUserDetails = function (id, db, onComplete) {
	var getUserDataQry = new JsSql();
	getUserDataQry.select(['password', 'user_type']);
	getUserDataQry.from(["users"]);
	getUserDataQry.where(["u_id = '" + id + "'"]);
	getUserDataQry.ready(db, "get", onComplete);
	getUserDataQry.fire();
};

var updateBookReturnDate = function(bookId, db, onComplete) {
	var date = new Date();
	var updateRDQry = new JsSql();
	updateRDQry.update("lending");
	updateRDQry.set(["return_date"]).values([String(date).slice(0,21)]);
	updateRDQry.where(["book_id='"+bookId+"'", "return_date='null'"]).connectors(["AND"]);
	updateRDQry.ready(db, "run", function(err){
		err || getBookNameOfId(bookId, db, onComplete);
	});
	updateRDQry.fire();
}

var _returnBook = function(bookId, db, onComplete) {
	var returnQry = new JsSql();
	returnQry.update("booksStatus");
	returnQry.set(["available","takenBy"]).values([1, null]);
	returnQry.where(["id='"+bookId+"'"]);
	returnQry.ready(db,"run", function(err){
		err || updateBookReturnDate(bookId, db, onComplete);
	});
	returnQry.fire();
}
var _addUser = function (userDetails, db, onComplete) {
	var addUserQuery = new JsSql();
	addUserQuery.insertInto('users');
	addUserQuery.values([userDetails.u_id, userDetails.password, userDetails.user_type]);
	addUserQuery.ready(db, "run", onComplete);
	addUserQuery.fire();
};

var init = function(location){
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];

			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};	
	};

	var records = {	
		getSearchedBooks : operate(_getSearchedBooks),
		borrowBook: operate(_borrowBook),
		getLendingsOfBookIdNOtReturned: operate(_getLendingsOfBookIdNOtReturned),
		addBook: operate(_addBook),
		getUserDetails: operate(_getUserDetails),
		returnBook: operate(_returnBook)
		addUser: operate(_addUser),
		getUserDetails: operate(_getUserDetails)
	};

	return records;
};

exports.init = init;
