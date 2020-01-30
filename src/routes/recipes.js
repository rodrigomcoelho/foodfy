const { Router } = require('express');
const multer = require('../app/middlewares/multer');
const router = Router();

const RecipeController = require('../app/controllers/RecipeController');

router.get('/', RecipeController.index);
router.get('/create', RecipeController.create);
router.get('/:id/edit', RecipeController.edit);
router.get('/:id', RecipeController.show);

router.post('/', multer.array('photos', 6), RecipeController.post);
router.put('/', multer.array('photos', 6), RecipeController.put);
router.delete('/', RecipeController.delete);

module.exports = router;