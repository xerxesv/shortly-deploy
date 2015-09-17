var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(err, results){
    res.send(200,results);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({'url': uri}, 'url', function(err, url){
    if(url){
      res.send(200, url);
    } else {
      util.getUrlTitle(uri, function (err, title){
        if(err) {
          console.log('Error reading URL headings: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save(function(err, newLink){
          if(!err){
            res.send(200, newLink);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username':username}, function(err, user){
    if(!user){
      res.redirect('/login');
    } else{
      user.comparePassword(password, function(match){
        if(match){
          util.createSession(req,res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  })
};

// exports.loginUser = function(req, res) {
//   var username = req.body.username;
//   var password = req.body.password;



//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         res.redirect('/login');
//       } else {
//         user.comparePassword(password, function(match) {
//           if (match) {
//             util.createSession(req, res, user);
//           } else {
//             res.redirect('/login');
//           }
//         })
//       }
//   });
// };

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}, 'username password', function(err, user){
    if(!user){
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword();
      newUser.save(function(err,newUser){
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};
exports.navToLink = function(req, res) {
  Link.findOne({'code': req.params[0]},'',function(err, link){
    console.log("LINK!", link);
    if(!link){
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err){
        if(err) {
          console.log("link saving error: ", err);
          return res.redirect('/');
        }else{
          return res.redirect(link.url);
        }
      });
    }
  });
};

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
// };