var location = process.argv[2];
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(location);

var runAllQuery = function () {
	var runQuery = function (query) {
		console.log(query);
		db.run(query, function (error) {
			if(error) {
				console.log(error);
				process.exit(1);
			}
		});
	};

	[
		"create table if not exists users(u_id integer not null primary key, password varchar2(30))",
		"create table if not exists booksStatus(id integer primary key, book_name varchar2(50), available integer, takenBy integer);",
		"create table if not exists lending(len_id integer primary key autoincrement, book_id integer, user_id integer,taken_date varchar2(30),return_date varchar2(30), foreign key(book_id) references books(id), foreign key(user_id) references users(u_id));"

	].forEach(runQuery);
};

db.serialize(runAllQuery);