var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('index');
});

router.post('/login', function (req, res) {
	var userInfo = req.body;
});

module.exports = router;
