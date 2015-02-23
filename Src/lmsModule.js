var sqlite3 = require("sqlite3").verbose();
var JsSql = require("./JsSql").JsSql;

var _getSearchedBooks = function(name,db,onComplete){
	var searchQry = new JsSql();
	searchQry.select();
	searchQry.from(["books"]);
	searchQry.where(["book_name='"+name+"'"]);
	searchQry.ready(db,"all",onComplete);
	searchQry.fire();
}


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
		getSearchedBooks : operate(_getSearchedBooks)
	};
	return records;
};

exports.init = init;
