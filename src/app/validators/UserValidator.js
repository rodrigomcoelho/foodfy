const User = require('../models/User');
class UserValidator
{
  async post(req, res, next)
  {
    const { userId } = req.session;

    if (!userId)
      return res.render('./session/login', { error: 'Você não está logado' });

    const { name, email, isAdmin } = req.body

    const is_admin = isAdmin ? true : false;

    const newUser = { name, email, is_admin };

    const loggedUser = await User.findById(userId);

    if (!loggedUser.is_admin)
      return res.render('./users/create', 
      { 
        error: 'Somente Administradores podem cadastrar novos usuários',
        user: newUser 
      });

    let user = await User.findOne({ where: { email } });

    user = user[0];

    if (user)
      return res.render('./users/create', 
      { 
        user: newUser, 
        error: 'Já existe um usuário cadastrado com esse email' 
      });

    req.user = newUser;

    return next();
  }
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

    const { name, email, is_admin } = user;

    req.user = { id, name, email, is_admin };

    return next();
  }

  async delete(req, res, next)
  {
    const { id } = req.body;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido' });

    const { userId } = req.session;

    if (!userId)
      return res.render('./session/login', { error: 'Usuário não está logado' });

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não existe' });

    if (!user.id == userId)
      return res.render('./users/index', { error: 'Você não pode deletar sua própria conta'});

    req.user = user;

    return next();
  }

  async put(req, res, next)
  {
    
    const { userId } = req.session;
    
    if (!userId)
      return res.render('./session/login', { error: 'Usuário não está logado'});

    const loggedUser = await User.findById(userId);

    if (!loggedUser)
      return res.render('./session/login', { error: 'Usuário não encontrado'});
    
    const { id } = req.body;

    if (!id)
      return res.render('./users/index', { error: 'Parametro inválido'});

    const user = await User.findById(id);

    if (!user)
      return res.render('./users/index', { error: 'Usuário não encontrado'});

    if (!loggedUser.is_admin)
      return  res.render('./users/edit', { error: 'Você não é administrador', user: loggedUser });

    const { name, email, isAdmin } = req.body;

    const is_admin = isAdmin ? true : false;

    req.user = { id, name, email, is_admin };

    console.log(req.user);

    return next();
  }
}

module.exports = new UserValidator();