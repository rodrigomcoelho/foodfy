const { Router } = require('express');
const router = Router();

const UserController = require('../app/controllers/UserController');

router.get('/', UserController.index);
router.get('/create', UserController.create);
router.get('/:id/edit', UserController.edit);
router.get('/:id', UserController.show);

router.post('/', UserController.post);
router.put('/', UserController.put);
router.delete('/', UserController.delete);

module.exports = router;