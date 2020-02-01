const { hash } = require('bcryptjs');
const faker = require('faker');

const User = require('./src/app/models/User');
const Recipe = require('./src/app/models/Recipe');
const LoadFile = require('./src/app/services/LoadFile');
const LoadChef = require('./src/app/services/LoadChef');

let usersIds = [];
let chefIds = [];
let recipeIds = [];
let totalUsers = 6;
let TotalChefs = 12;
let TotalRecipes = 44;

async function createUsers()
{
    const users = [];
    const password = await hash('123', 8);

    while (users.length < totalUsers )
    {
        users.push(
        {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: Math.random() > 0.5
        });
    }

    const usersPromise = users.map(user => User.create(user));

    usersIds = await Promise.all(usersPromise);
}

async function createChefs()
{
  let chefs = [];

  while(chefs.length < TotalChefs)
  {
    chefs.push(
    {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      filename: faker.image.image(),
      path: `public/images/placeholder.png`
    });
  }

  const chefsPromise = chefs.map(chef => LoadChef.createOne(chef)); 

  chefIds = await Promise.all(chefsPromise);
}

async function createRecipes()
{
  let recipes = [];

  while (recipes.length < TotalRecipes)
  {
    recipes.push(
    {
      chef_id: chefIds[Math.floor(Math.random() * TotalChefs)], 
      title: faker.name.title(),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      ingredients: [
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2))
      ],
      preparation: [
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2)),
        faker.lorem.paragraph(Math.ceil(Math.random() * 2))
      ],
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 2))
    });
  }

  const promiseRecipes = recipes.map(recipe => Recipe.create(recipe));

  recipeIds = await Promise.all(promiseRecipes);

  let files = [];

  for (let index = 0; index < recipeIds.length; index++) 
  {

    files.push(
    {
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
      recipe_id: recipeIds[index]
    });

    files.push(
    {
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
      recipe_id: recipeIds[index]
    });

    files.push(
    {
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
      recipe_id: recipeIds[index]
    });
  
  }

 

  // while (files.length < TotalRecipes * 3)
  // {
  //   files.push(
  //   {
  //     name: faker.image.image(),
  //     path: `public/images/placeholder.png`,
  //     recipe_id: recipeIds[Math.floor(Math.random() * TotalRecipes)]
  //   });
  // }

  const filesPromise = files.map(file => LoadFile.create(file));

  await Promise.all(filesPromise);

}

async function createAdmin()
{
  await User.create(
    {
      name: 'Rodrigo Coelho',
      email: 'rodrigo.coelho@hotmail.com.br',
      password: await hash('123', 8),
      is_admin: true
    });
}

// async function createProducts()
// {
//     let products = [];

//     while(products.length < totalProducts)
//     {
//         products.push(
//         {
//             category_id: Math.ceil(Math.random() * 3),
//             user_id: usersIds[Math.floor(Math.random() * totalUsers)],
//             name: faker.name.title(),
//             description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
//             old_price: faker.random.number(9999),
//             price: faker.random.number(9999),
//             quantity: faker.random.number(99),
//             status: Math.round(Math.random())
//         });
//     }

//     const productsPromise = products.map(product => Product.create(product));

//     productsIds = await Promise.all(productsPromise);

//     let files = []
//     while(files.length < 50)
//     {
//         files.push(
//         {
//             name: faker.image.image(),
//             path: `public/images/placeholder.png`,
//             product_id: productsIds[Math.floor(Math.random() * totalProducts)]
//         });
//     }

//     const filesPromise = files.map(file => File.create(file));

//     await Promise.all(filesPromise);

// }

async function init()
{
    await createUsers();
    await createChefs();
    await createRecipes();
    //await createAdmin();
    // await createProducts();
}



init();

