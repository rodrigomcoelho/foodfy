const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const LoadRecipe = require('../services/LoadRecipe');
const LoadFile = require('../services/LoadFile');

module.exports = {
  async index(req, res)
  {
    try
    {
      let { search, page, limit } = req.query;

      page = page || 1;
      limit = limit || 8;

      let offset = limit * (page - 1);

      const recipes = await LoadRecipe.findAll(undefined, 
      { 
        limit,
        offset,
        count: true,
        orderBy: 'updated_at desc' 
      });

      const pagination = 
      {
        search,
        page,
        total: recipes.length > 0 ? Math.ceil(recipes[0]._counttable / limit) : 0
      };

      return res.render('./recipes/index', { recipes, pagination });
    } catch (error)
    {
      console.error(error);
    }
  },

  async create(req, res)
  {
    try
    {
      const chefs = await Chef.findAll();
      return res.render('./recipes/create', { chefs });
    } catch (error)
    {
      console.error(error);
    }
  },

  async post(req, res)
  {
    try
    {
      const { chef_id, title, ingredients, preparation, information } = req.body;

      const user_id = req.session.userId;

      const id = await Recipe.create({ chef_id, title, ingredients, preparation, information, user_id });

      if (!id)
        throw new Error(`Invalid recipe id: ${id}`);

      const filesPromise = req.files.map(async file => 
      {
        await LoadFile.create(
          {
            name: file.filename,
            path: file.path,
            recipe_id: id
          });
      });

      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/${id}`);
    } catch (error)
    {
      console.error(error);
      const chefs = await Chef.findAll();
      return res.render('./recipes/create', { chefs, error });
    }
  },

  async edit(req, res)
  {
    try
    {
      const { id } = req.params;
      const recipe = await LoadRecipe.findOne({ where: { id } });

      if (!recipe)
        return res.render('./recipes/index', { error: 'Receita não encontrada' });

      const chefs = await Chef.findAll();

      return res.render('./recipes/edit', { recipe, chefs });
    } catch (error)
    {
      console.error(error);

    }
  },

  async show(req, res)
  {
    try
    {
      const { id } = req.params;
      let recipe = await LoadRecipe.findOne({ where: { id } });

      if (!recipe)
        return res.render('./recipes/index', { error: 'Receita não encontrada' });

      return res.render('./recipes/show', { recipe });
    } catch (error)
    {
      console.error(error);
    }
  },

  async put(req, res)
  {
    try
    {
      const { id, chef_id, title, ingredients, preparation, information } = req.body;

      await Recipe.update(id, { chef_id, title, ingredients, preparation, information });

      if (req.body.removedImagens)
      {
        const removedFiles = req.body.removedImagens.split(',');
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromisse = removedFiles.map(async id => await LoadFile.deleteOneFile(id));

        await Promise.all(removedFilesPromisse);
      }

      if (req.files.length != 0)
      {
        const newFilesPromisse = req.files.map(file => LoadFile.create(
          {
            name: file.filename,
            path: file.path,
            recipe_id: id
          }));

        await Promise.all(newFilesPromisse);
      }

      return res.redirect(`/admin/recipes/${id}`);
    } catch (error)
    {
      console.error(error);
    }
  },

  async delete(req, res)
  {
    try
    {
      const { id } = req.body;
      await Recipe.delete(id);

      return res.redirect('/admin/recipes');
    } catch (error)
    {
      console.error(error);
    }
  },
};