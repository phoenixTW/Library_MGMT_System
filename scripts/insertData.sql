insert into users values (1, "11111");
insert into users values (2, "11112");
insert into users values (12345, "mahesh"); 

insert into booksStatus (id,book_name, available) values (12345,"JAVA", 1);
insert into booksStatus (id,book_name, available, takenBy) values (12346,"Javascript Reference", 0, 1);
insert into booksStatus (id,book_name, available) values (12347,"MySql", 1);

insert into lending (book_id, user_id,taken_date,return_date) values (12345, 1,"12-feb-2015","10-feb-2015");
insert into lending (book_id, user_id,taken_date,return_date) values (12346, 2,"2-feb-2015",null);
