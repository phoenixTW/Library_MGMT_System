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
		addBook: operate(_addBook),
		getUserDetails: operate(_getUserDetails)
		// canBooksReturnByUser: operate(_canBooksReturnByUser)
	};
	return records;
};

exports.init = init;
