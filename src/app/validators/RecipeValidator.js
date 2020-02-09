const Recipe = require('../services/LoadRecipe');
const Chef = require('../models/Chef');

async function getChefs()
{
  return await Chef.findAll();
}

class RecipeValidator
{
  async post(req, res, next)
  {
    const { chef_id } = req.body; 

    if (!chef_id)
    {
      const  chefs = await getChefs();
      return res.render('./recipes/create', { 
        chefs, 
        error: 'Você não pode cadastrar uma receita sem chefs' 
      });
    }
    
    return next();
  }
  async put(req, res, next)
  {
    const { id } = req.body;
    const { userId, isAdmin } = req.session;

    const recipe = await Recipe.findOne({ where: { id }});

    if (!recipe)
      return res.render('./recipes/edit', { recipe, error: 'Receita não encontrada' });

    const chefs = await Chef.findAll();

    if (recipe.user_id != userId && !isAdmin) 
      return res.render('./recipes/edit', 
      { 
        recipe,
        chefs,
        error: 'Você não pode editar receitas de outros usuários' 
      });

    return next();
  }

  async edit(req, res, next)
  {
    const { id } = req.params;
    const { userId, isAdmin } = req.session;

    const recipe = await Recipe.findOne({ where: { id }});

    if (!recipe)
      return res.render('./recipes/index', { recipe, error: 'Receita não encontrada' });

    if (userId != recipe.user_id && !isAdmin)
      return res.redirect('back');

    return next();
  }

  async delete(req, res, next)
  {
    const { id } = req.body;
    const { userId } = req.session;

    const recipe = await Recipe.findOne({ where: { id }});

    if (!recipe)
      return res.render('./recipes/edit', { recipe, error: 'Receita não encontrada' });

    const chefs = await Chef.findAll();

    if (recipe.user_id != userId)
      return res.render('./recipes/edit', 
      { 
        recipe,
        chefs,
        error: 'Você não pode deletar receitas de outros usuários' 
      });

    return next();
  }
}

module.exports = new RecipeValidator();