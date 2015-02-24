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
		"create table if not exists users(u_id varchar not null primary key, password varchar2(30), user_type text)",
		"insert into users values('SUPER_USER', 'thoughtworks', 'S')",
		"create table if not exists booksStatus(id varchar primary key, book_name varchar2(50), available integer, takenBy varchar);",
		"create table if not exists lending(len_id integer primary key autoincrement, book_id varchar, user_id varchar,taken_date varchar2(30),return_date varchar2(30), foreign key(book_id) references booksStatus(id), foreign key(user_id) references users(u_id));"
	].forEach(runQuery);
};

db.serialize(runAllQuery);