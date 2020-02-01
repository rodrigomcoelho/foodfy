const Recipe = require('../services/LoadRecipe');
const Chef = require('../models/Chef');

class RecipeValidator
{
  async put(req, res, next)
  {
    const { id } = req.body;
    const { userId } = req.session;

    const recipe = await Recipe.findOne({ where: { id }});

    if (!recipe)
      return res.render('./recipes/edit', { recipe, error: 'Receita não encontrada' });

    const chefs = await Chef.findAll();

    if (!recipe.user_id != userId)
      return res.render('./recipes/edit', 
      { 
        recipe,
        chefs,
        error: 'Você não pode editar receitas de outros usuários' 
      });

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

    if (!recipe.user_id != userId)
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