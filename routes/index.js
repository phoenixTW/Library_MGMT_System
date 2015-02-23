var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/userSearch', function(req, res) {
  	res.render('userSearch');
});

router.post('/userSearch', function(req, res) {
	var book = req.body.name;
 	lib.getSearchedBooks(book,function(err,topics){
 		console.log("---->",topics)
	  	res.render('userSearch',{topics:topics});
  });
});


module.exports = router;
