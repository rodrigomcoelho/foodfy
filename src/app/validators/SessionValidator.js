const User = require('../models/User');
const { compare } = require('bcryptjs');

module.exports = {
  async login(req, res, next)
  {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.render('./session/login', 
      { 
        error: 'Usuário não encontrado', 
        user: req.body 
      });
    
    if (!(await compare(password, user.password)))
      return res.render('session/login',{ user: req.body, error: 'Senha incorreta' }); 

    req.user = user;

    return next();
  },

  async forgot(req, res, next)
  {
    const { email } = req.body;

    try 
    {
      let user = await User.findOne({ where: { email } });

      if (!user)
        return res.render('session/forgot-password', { user: req.body, error: 'Usuário não encontrado' });

      req.user = user;

      return next();

    } catch (error) 
    {
      return res.render('session/forgot-password', { user: req.body, error });
    }
  },

  async reset(req, res, next)
  {
    const route = 'session/password-reset';

    const { email, password, passwordRepeat , token } = req.body;

    const user = await User.findOne({ where: { email } });

    if(!user)
      return res.render(route, 
      {
        error: 'Usuário não encontrado', 
        userLogin: req.body, 
        token 
      });

    if (password != passwordRepeat)
        return res.render(route, 
        { 
          error: 'Senhas não são iguais', 
          token 
        });

    if (token != user.reset_token)
        return res.render(route, 
        {
          error: `Token inválido: '${token}' & user ${user.reset_token}`,
          token 
        });

    let now = new Date();
    now = now.setHours(now.getHours());

    if (now > user.reset_token_expires)
        return res.render(route, { error: 'Link expirado. Por favor solicite uma nova recuperação de senha', token });

    req.user = user;

    return next();
  }
}