var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var bcrypt = require("bcryptjs");
/* GET users listing. */
router.get('/', function(req, res) {
  res.redirect('index');
});

var loadUserFromSession = function(req, res, next) {
  var user = req.session.userID;
  if (user) {
    req.user = user;
    res.locals.user = user;
  } else {
    delete req.session.userID;
  }
  next();
};

var requireLogin = function(req, res, next) {
  req.user ? next() : res.redirect('/');
};

router.use(loadUserFromSession);

router.post('/login', function (req, res) {
	var userInfo = req.body;

	lib.getUserDetails(userInfo.user_id, function (error, data) {
		if(!error && (data.password == userInfo.pwd)) {
			req.session.userID = userInfo.user_id;
			req.session.user_type = data.user_type;

			(data.user_type == "S") && res.redirect("dashboard/superuser");
		}

		else res.render('index', {message: "Invalid ID or password"});
	});
});

router.get('/dashboard/superuser', requireLogin, function (req, res) {
	res.render('superUserDash', null);
});

router.get('/logout', requireLogin, function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
