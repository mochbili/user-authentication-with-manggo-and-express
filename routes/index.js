var express = require('express');
var router = express.Router();
var User = require('../model/user');
var mid = require('../middleware');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/profile', mid.requiredLogin, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function(error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook});
        }
      });
});

router.get('/remove-account', mid.requiredProfile, function(req, res, next) {
  User.remove({'_id': req.session.userId})
      .exec(function(error) {
        if (error) {
          return next(error);
        } else {
          req.session.destroy();
          return res.redirect('/');
        }
      });
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/login', mid.loggedOut, function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

router.get('/register', mid.loggedOut,  function(req, res, next) {
  res.render('register', { title: 'Sign Up!' });
});

router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {

      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      const userData = {
        name: req.body.name,
        email: req.body.email,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password,
      }

      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user.id;
          return res.redirect('/profile');
        }
      });
    
  } else {
    var err = new Error('All fields are required');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
