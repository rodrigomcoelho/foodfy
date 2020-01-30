const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const RecipeFile = require('./LoadFile');

async function includeDepencies(paramIn)
{
  let results = [];
  let recipes = [];

  if (!Array.isArray(paramIn))
    results.push(paramIn);
  else
    results = paramIn;

  const promise = results.map(async recipe =>
  {
    recipe.author = await includeAuthor(recipe);
    recipe.files = await includeFiles(recipe);
    recipes.push(recipe);
  });

  await Promise.all(promise);

  return recipes;
}

async function includeAuthor({ chef_id })
{
  return await Chef.findById(chef_id);
}

async function includeFiles({ id })
{
  let files = await RecipeFile.findByRecipe(id);
  files = files.map(file =>
  {
    return {
      ...file,
      src: (`${file.path.replace('public', '')}`).split('\\').join('/')
    };
  });

  return files;
}

const LoadRecipe =
{
  selectOptions: () => ({ limit: 0, orderby: null }),
  async findOne(filter)
  {
    let results = await Recipe.findOne(filter);

    results = await includeDepencies(results);

    return results[0];

  },
  async findAll(filter, options = LoadRecipe.selectOptions())
  {
    let results = await Recipe.findTop(filter, options.limit, options.orderby);

    results = await includeDepencies(results);

    return results;
  },

  async findAllLike(filter, options = this.selectOptions())
  {
    let results = await Recipe.findLike(filter, options.limit, options.orderby);

    results = await includeDepencies(results);

    return results;
  }
};

module.exports = LoadRecipe;