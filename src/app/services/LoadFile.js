const fs = require('fs');

const File = require('../models/File');
const FileRecipe = require('../models/RecipeFile');

async function create({ name, path, recipe_id })
{
  const file_id = await File.create({ name, path });

  await FileRecipe.create({ file_id, recipe_id });
};

async function deleteFilesByRecipe({ recipe_id })
{
  const files = await FileRecipe.findAll({ where: { recipe_id } });
  const filePromise = files.map(async file =>
  {
    await FileRecipe.delete(file.id);
    await File.delete(file.file_id);

    try
    {
      fs.unlinkSync(file.path);
    } catch (error)
    {
      console.error(`Unable to remove this file ${file.path}`);
    }

  });

  await Promise.all(filePromise);
};

async function findByRecipe(recipeId)
{
  const files = [];
  const fileRecipes = await FileRecipe.findAll({ where: { recipe_id: recipeId } });

  const filePromise = fileRecipes.map(async file =>
  {
    const result = await File.findById(file.file_id);

    files.push({ ...file, ...result });
  });

  await Promise.all(filePromise);

  return files;

}

async function deleteOneFile(id)
{
  let path = '';
  try 
  {
    const file = await File.findById(id);

    if (!file)
      return;

    path = file.path;

    const fileRecipes = await FileRecipe.findOne({ where: { file_id: id } });

    const promiseFiles = fileRecipes.map(async fileRecipe =>
    {
      await FileRecipe.delete(fileRecipe.id)
        .then(await File.delete(file.id)
          .then(fs.unlinkSync(file.path)));
    });

    await Promise.all(promiseFiles);

  } catch (error)
  {
    console.error(`Unable to remove this file ${path}`);
  }
}

module.exports =
{
  create,
  deleteFilesByRecipe,
  findByRecipe,
  deleteOneFile,
};