const { randomBytes } = require('crypto');
const { hash } = require('bcryptjs');
const User = require('../models/User');
const mailer = require('../../libs/mailer');

class UserController
{
  async index(req, res)
  {
    const users = await User.findAll();
    return res.render('./users/index', { users });
  }

  create(req, res)
  {
    return res.render('./users/create');
  }

  async post(req, res)
  {
    try
    {
      const { name, email, isAdmin } = req.body;

      const is_admin = isAdmin ? true : false;

      const reset_token = randomBytes(20).toString('hex');

      const password = await hash(email, 8);

      const id = await User.create({ name, email, is_admin, reset_token, password });

      const user = await User.findById(id);

      await mailer.sendMail({
        to: user.email,
        from: 'noreply@foodfy.com.br',
        subject: 'Usuário criado com sucesso',
        html: `<h2>Bem vindo ao foodfy ${user.name}<h/2>
                <p>Clique no link abaixo onde você será direcionado ao pagina de nova senha.</p>    
                <p><a href="http://localhost:3000/session/new-password?token=${reset_token}" target="_blank">Nova Senha</a></p>`
      });

      return res.redirect(`/admin/show/${id}`);

    } catch (error)
    {
      return res.render('./users/create', { error });
    }

  }

  async show(req, res)
  {
    const user = req.user;

    return res.render('users/edit', { user });
  }

  async edit(req, res)
  {
    return res.render('users/edit', { user: req.user});
  }

  async put(req, res)
  {
    const user = req.user;

    await User.update(user.id, user);

    return res.redirect(`/admin/users/${user.id}/edit`);

  }

  async delete(req, res)
  {
    const user = req.user;

    await User.delete(user.id);

    return res.render('users/index', { success: 'Usuário removido com sucesso' });
  }
}

module.exports = new UserController();