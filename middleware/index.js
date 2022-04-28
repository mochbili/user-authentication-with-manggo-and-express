function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  return next();
}

function requiredLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You are not authorized to view this page lol!');;
    err.status = 401;
    return next(err);
  }
}

function requiredProfile(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You are can not delete a profile');;
    err.status = 403;
    return next(err);
  }
}

module.exports.loggedOut = loggedOut;
module.exports.requiredLogin = requiredLogin;
module.exports.requiredProfile = requiredProfile;