var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var lmsLib = require('../Src/lmsLib');
var rl = require('./users').rl;

router.get(['/', '/login'], function(req, res) {
  res.render('index', { title: 'router' });
});

router.get('/userSearch',rl.requireLogin, function(req, res) {
  	res.render('userSearch');
});

router.get('/search', rl.requireLogin, function(req, res) {
	var book = req.query.name;
	var userId = req.session.userID;
 	lib.getSearchedBooks(book,function(err,books){
	  	res.render('userSearch',{books:books, userId:userId});
	});
});

router.get('/adminSearch',rl.requireLogin, function (req, res) {
	res.render('adminSearch');
});

router.post('/adminSearch',rl.requireLogin, function (req, res) {
	var book = req.body.name;
 	lib.getSearchedBooks(book,function(err,books){
		 var booksStatistics = books && lmsLib.countBooks(books);
		 res.render('adminSearch', {books : booksStatistics});
  	});
});

router.get('/borrow/:id', rl.requireLogin, function(req, res) {
	var userId = req.session.userID;
	var bookId = req.params.id;
	lib.borrowBook([bookId, userId], function(err, book){
		res.redirect('/search?name='+book.book_name);
	});
});

router.get('/addBook', rl.requireLogin, function (req, res) {
	res.render('addBook');
});

router.post('/addBook', rl.requireLogin, function (req, res) {
	var data = {id: req.body.id, name: req.body.name};
	lib.addBook(data, function (err, data){
		if(err) res.render('addBook',{message: "Invalid book ID"}); 
		res.render('addBook',{message: "Book added successfully"}); 
	});
});

router.get('/return/:id',rl.requireLogin,function(req,res){
	var bookId = req.params.id;
	lib.returnBook(bookId, function(err, book){
		res.redirect('/search?name='+book.book_name);
	});
});

router.get('/bookHistory/:name', rl.requireLogin, function(req,res){
	var bookName = req.params.name;
	lib.getBookHistory(bookName,function(err,bookHistory){
		res.render('bookHistory',{history:bookHistory,bookName:bookName});
	});
});
module.exports = router;
