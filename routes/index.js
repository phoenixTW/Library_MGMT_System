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

router.post('/userSearch', function(req, res) {
	var book = req.body.name;
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

router.get('/addBook', function (req, res) {
	res.render('addBook');
});

router.post('/addBook', function (req, res) {
	var data = {id: req.body.id, name: req.body.name};
	lib.addBook(data, function (err, data){
		res.redirect('addBook');
	});
});


module.exports = router;
