const { Router } = require('express');
const multer = require('../app/middlewares/multer');

const router = Router();

const ChefController = require('../app/controllers/ChefController');

router.get('/create', ChefController.create);
router.get('/:id/edit', ChefController.edit);
router.get('/:id', ChefController.show);
router.get('/', ChefController.index);

router.post('/', multer.array('photos', 6), ChefController.post);
router.put('/', multer.array('photos', 6), ChefController.put);
router.delete('/', ChefController.delete);

module.exports = router;