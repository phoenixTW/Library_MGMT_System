var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var lmsLib = require('../Src/lmsLib');

console.log(lib);
router.get('/', function(req, res) {
  res.render('index', { title: 'router' });
});

router.get('/userSearch', function(req, res) {
  	res.render('userSearch');
});

router.post('/userSearch', function(req, res) {
	var book = req.body.name;
 	lib.getSearchedBooks(book,function(err,topics){
	  	res.render('userSearch',topics);
  });
});

router.get('/adminSearch', function (req, res) {
	res.render('adminSearch');
});

router.post('/adminSearch', function (req, res) {
	var book = req.body.name;
 	lib.getSearchedBooks(book,function(err,books){
 		console.log(books);
		 var booksStatistics = books && lmsLib.countBooks(books);
		 console.log(booksStatistics);
		 res.redirect('/adminSearch');
  	});
});


module.exports = router;
