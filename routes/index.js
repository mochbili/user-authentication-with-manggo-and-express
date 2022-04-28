var express = require('express');
var router = express.Router();
var User = require('../model/user');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/register', function(req, res, next) {
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
