const crypto = require('crypto');
const { hash, compare } = require('bcryptjs');

const User = require('../models/User');

class SessionController
{
  newPassword(req, res)
  {
    return res.render('session/new-password', { token: req.query.token });
  }

  async resetPassword(req, res)
  {
    try 
    {
      let { email, password } = req.body;

      password = await hash(password, 8);
      let user = await User.findOne({ where: { email } });

      user = user[0];

      if (!user)
        return res.render('session/new-password', { error: `Usuário ${email} não encontrado` });

      await User.update(user.id,
      {
        password,
        reset_token: '',
        reset_token_expires: ''
      });

      return res.render('session/login', { success: 'Senha Alterada', userLogin: req.body });

    } catch (error) 
    {
      console.log(error);
      return res.render('session/password-reset', { error, token });
    }
  }

  loginIndex(req, res)
  {
    return res.render('session/login');
  }

  async login(req, res)
  {
    req.session.userId = req.user.id;
    req.session.userName = req.user.name;
    
    return res.redirect('/');
  }

  logout(req, res)
  {
    req.session.destroy();
    return res.redirect('/session/login');
  }

  forgotIndex(req, res)
  {
    return res.render('session/new-password');
  }

  async forgot(req, res)
  {
    try 
    {
      const user = req.user;

      const token = crypto.randomBytes(20).toString('hex');

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, 
      {
        reset_token: token,
        reset_token_expires: now
      });

      await mailer.sendMail(
      {
          to: user.email,
          from: 'noreply@foodfy.com.br',
          subject: 'Recuperar Senha',
          html: `<h2>Perdeu a chave da cozinha?<h/2>
                  <p>Clique para recupera-la</p>    
                  <p><a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">Nova Chave</a></p>`
      });

      return res.render('session/login', {success: 'Email enviado, verifique sua caixa de email'});

    } catch (error) 
    {
      console.error(error);
      return res.render('session/new-password', { error });
    }
  }
}

module.exports = new SessionController();