var express = require('express');
var router = express.Router();
var lib = require('../Src/lmsModule').init("./data/lms.db");
var bcrypt = require("bcryptjs");
/* GET users listing. */
router.get(['/', '/login'], function(req, res) {
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
  req.session.userID ? next() : res.redirect('/');
};

router.use(loadUserFromSession);

router.post('/login', function (req, res) {
  var userInfo = req.body;


  lib.getUserDetails(userInfo.user_id, function (error, data) {
    if(!error && data && bcrypt.compareSync(userInfo.pwd,data.password)) {
      req.session.userID = userInfo.user_id;
      req.session.user_type = data.user_type;
      
      (data.user_type == "S") && res.redirect("/addUser");
      (data.user_type == "A") && res.redirect("dashboard/admin");
      (data.user_type == "U") && res.redirect("/userSearch");

    }

    else res.render('index', {message: "Invalid ID or password"});
  });
});

router.get('/addUser', requireLogin, function (req, res) {
  (req.session.user_type == "S") && res.render('superUserDash', null);
  (req.session.user_type == "A") && res.render('addUser', null);
});

router.get('/dashboard/user', requireLogin, function (req, res) {
  res.render('user', null);
});

router.get("/dashboard/admin", requireLogin, function (req, res) {
  res.render("admin");
});

router.post('/addUser', requireLogin, function (req, res) {
    var newUserDetails = req.body;
    newUserDetails.password = bcrypt.hashSync(newUserDetails.password);
    newUserDetails.u_id = req.body.u_id.toLowerCase();

    (req.session.user_type == 'S')
      ? newUserDetails.user_type = 'A'
      : newUserDetails.user_type = 'U';
    
    lib.addUser(newUserDetails, function (err) {
      (req.session.user_type == "S") && renderSuperUser(err, res);
      (req.session.user_type == "A") && renderAdmin(err, res);
    });
});

var renderSuperUser = function (err, res) {
      err && 
        res.render('superUserDash', {message: "Invalid ADMIN ID", isSuccess: 0});
      !err && 
        res.render('superUserDash', {message: "New Admin added successfully", isSuccess: 1});
};

var renderAdmin = function (err, res) {
      err && 
        res.render('addUser', {message: "Invalid USER ID", isSuccess: 0});
      !err && 
        res.render('addUser', {message: "New USER added successfully", isSuccess: 1});
};

router.get('/logout', requireLogin, function(req, res) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
var rl = {};
rl.requireLogin = requireLogin;
module.exports.rl = rl;
