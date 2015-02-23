var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var bcrypt = require("bcryptjs");
/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('index');
});

router.post('/login', function (req, res) {
	var userInfo = req.body;
	console.log(userInfo);
	lib.getUserDetails(userInfo.user_id, function (error, data) {
		console.log(data);
		if(!error && (data.password == userInfo.pwd)) {
			console.log(req.session);
			req.session.userID = userInfo.user_id;
			req.session.user_type = data.user_type;

			(data.user_type == "S") && res.redirect("dashboard/superuser");
		}

		else res.render('index', {message: "Invalid ID or password"});
	});
});

router.get('/dashboard/superuser', function (req, res) {
	res.render('superUserDash', null);
});

module.exports = router;
