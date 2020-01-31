const User = require('../models/User');
class UserValidator
{
  async show(req, res, next)
  {
    const { id } = req.params;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    req.user = user;

    return next();
  }

  async edit(req, res, next)
  {
    const { id } = req.params;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    const { name, email, is_admin: isAdmin } = user;

    req.user = { id, name, email, isAdmin };

    return next();
  }
}

module.exports = new UserValidator();