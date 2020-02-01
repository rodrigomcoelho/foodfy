const LoadRecipe = require('../services/LoadRecipe');

module.exports = {
  async index(req, res)
  {
    try 
    {
      const recipes = await LoadRecipe.findAll(null, { limit: 6, orderby: 'updated_at desc' });

      return res.render('./home/index', { recipes });

    } catch (error) 
    {
      console.error(error);
    }
  },

  async show(req, res)
  {
    try 
    {
      const recipe = await LoadRecipe.findOne({ where: { id: req.params.id } });

      if (!recipe)
        return res.render('./home/index', { error: 'Receita não encontrada' });

      return res.render('./home/show', { recipe });

    } catch (error) 
    {
      console.error(error);
    }
  },

  async search(req, res)
  {
    try 
    {
      const { search } = req.query;

      const recipes = await LoadRecipe.findAllLike({ where: { title: search } });

      return res.render('./home/search', { recipes, search });

    } catch (error) 
    {
      console.error(error);
    }
  },
};