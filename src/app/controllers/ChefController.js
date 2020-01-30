const LoadChef = require('../services/LoadChef');

module.exports = {

  async index(req, res)
  {
    const chefs = await LoadChef.findAll();
    return res.render('./chefs/index', { chefs });
  },

  create(req, res)
  {
    return res.render('./chefs/create');
  },

  async post(req, res)
  {
    const { filename, path } = req.files[0];
    const { name } = req.body;

    try
    {
      const id = await LoadChef.createOne({ name, filename, path });

      return res.redirect(`/admin/chefs/${id}`);

    } catch (error)
    {
      console.error(error);
      require('fs').unlinkSync(path);
      return res.render('/admin/chefs/create', { error });
    }

  },

  async show(req, res)
  {
    const { id } = req.params;

    const chef = await LoadChef.findOne({ where: { id } });

    return res.render('./chefs/show', { chef });
  },

  async edit(req, res)
  {
    const { id } = req.params;

    const chef = await LoadChef.findOne({ where: { id } });

    return res.render('./chefs/edit', { chef });
  },

  async put(req, res)
  {
    const { id, name } = req.body;
    let filename = '';
    let path = '';

    try
    {
      if (req.files && req.files.length > 0)
      {
        filename = req.files[0].filename;
        path = req.files[0].path;
      }

      await LoadChef.updateOne(id, { name, filename, path });

      return res.redirect(`/admin/chefs/${id}`);

    } catch (error)
    {
      console.log(error);
      require('fs').unlinkSync(path);
      const chef = await LoadChef.findOne({ where: { id } });
      return res.render('./chefs/edit', { chef });
    }
  },

  async delete(req, res)
  {
    const { id } = req.body;

    const chef = await LoadChef.findOne({ where: { id } });

    if (chef.recipes && chef.recipes.length > 0)
      return res.render('./chefs/edit', { chef, error: `${chef.name} não pode ser excluído pois possui receitas ativas` });

    await LoadChef.deleteOne(id);

    return res.redirect('/admin/chefs/');
  }

};