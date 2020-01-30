const fs = require('fs');
const Chef = require('../models/Chef');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');
const Recipe = require('../models/Recipe');

async function includeDepencies(paramIn)
{
  let results = [];
  let chefs = [];

  if (!Array.isArray(paramIn))
    results.push(paramIn);
  else
    results = paramIn;

  const promise = results.map(async chef =>
  {
    chef.avatar = await includeFiles(chef);
    chef.recipes = await includeRecipes(chef);
    return { ...chef };
  });

  chefs = await Promise.all(promise);

  return chefs;
}

async function includeFiles({ file_id })
{
  let file = await File.findById(file_id);

  file = { ...file, src: (`${file.path.replace('public', '')}`).split('\\').join('/') };

  return file;
}

async function includeRecipes({ id })
{
  let recipes = await Recipe.findAll({ where: { chef_id: id } }, 'updated_at desc');

  const recipePromise = recipes.map(async recipe =>
  {
    const fileRecipes = await RecipeFile.findAll({ where: { recipe_id: recipe.id } });

    recipe.image = await File.findById(fileRecipes[0].file_id);

    recipe.image = { ...recipe.image, src: (`${recipe.image.path.replace('public', '')}`).split('\\').join('/') };

    return { ...recipe };
  });

  recipes = await Promise.all(recipePromise);

  return recipes;
}

function deleteFile(path)
{
  try
  {
    fs.unlinkSync(path);
  } catch (error)
  {
    console.error(`No such file or directory: ${path}`);
  }
}

const LoadChef = {
  selectOptions: () => ({ limit: 0, orderby: null }),

  async findOne(filter)
  {
    let results = await Chef.findOne(filter);

    results = await includeDepencies(results);

    return results[0];
  },

  async findAll(filter, options = LoadChef.selectOptions())
  {
    let results = await Chef.findTop(filter, options.limit, options.orderby);

    results = await includeDepencies(results);

    return results;
  },

  async createOne({ name, filename, path })
  {
    const file_id = await File.create({ name: filename, path });

    const id = await Chef.create({ name, file_id });

    return id;
  },

  async deleteOne(id)
  {
    try
    {
      const chef = await Chef.findById(id);
      const file = await File.findById(chef.file_id);

      await Chef.delete(id)
        .then(await File.delete(file.id)
          .then(deleteFile(file.path)));

    } catch (error)
    {
      console.log(error);
    }

  },

  async updateOne(id, { name, filename, path })
  {
    if (!id || id < 0)
      throw new Error('Chef id is invalid');

    const chef = await Chef.findById(id);

    let file_id = chef.file_id;

    const file = await File.findById(file_id);

    if (path)
      file_id = await File.create({ name: filename, path });

    await Chef.update(id, { name, file_id });

    if (file && path)
    {
      await File.delete(file.id).then(deleteFile(file.path));
    }
  }
};

module.exports = LoadChef;