'use strict';

module.exports = {
  onlyUsers(req, res, next) 
  {
    if(!req.session.userId)
      return res.redirect('/session/login');

    return next();
  },

  isLogged(req, res, next)
  {
    if (req.session.userId)
      return res.redirect('/');

    return next();
  },
  async isAdmin(req, res, next)
  {
    if(!req.session.userId)
      return res.redirect('/session/login');

    if (!req.session.isAdmin)
      return res.redirect('/');

    return next();
  }
};