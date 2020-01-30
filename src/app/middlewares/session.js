'use strict'

module.exports = {
  onlyUsers(req, res, next) 
  {
    if(!req.session.userId)
      return res.redirect('/users/login');

    return next();
  },
  isLogged(req, res, next)
  {
    if (req.session.userId)
      return res.redirect('/users');

    return next();
  },
};