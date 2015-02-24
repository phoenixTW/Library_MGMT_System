var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var lmsLib = require('../Src/lmsLib');

router.get('/', function(req, res) {
  res.render('index', { title: 'router' });
});

router.get('/userSearch', function(req, res) {
  	res.render('userSearch');
});

router.get('/search', function(req, res) {
	var book = req.query.name;
	var userId = 12345;
 	lib.getSearchedBooks(book,function(err,books){
	  	res.render('userSearch',{topics:books, userId:userId});
	});
});

router.get('/adminSearch', function (req, res) {
	res.render('adminSearch');
});

router.post('/adminSearch', function (req, res) {
	var book = req.body.name;
 	lib.getSearchedBooks(book,function(err,books){
		 var booksStatistics = books && lmsLib.countBooks(books);
		 res.render('adminSearch', {books : booksStatistics});
  	});
});

router.get('/borrow/:id', function(req, res) {
	var userId = 12345;
	var bookId = req.params.id;
	lib.borrowBook([bookId, userId], function(err, book){
		res.redirect('/search?name='+book.book_name);
	});
});

router.get('/addBook', function (req, res) {
	res.render('addBook');
});

router.post('/addBook', function (req, res) {
	var data = {id: req.body.id, name: req.body.name};
	lib.addBook(data, function (err, data){
		if(err) res.render('addBook',{message: "Invalid book ID"}); 
		res.render('addBook',{message: "Book added successfully"}); 
	});
});

router.get('/return/:id',function(req,res){
	var bookId = req.params.id;
	lib.returnBook(bookId, function(err, book){
		res.redirect('/search?name='+book.book_name);
	});
});

module.exports = router;
