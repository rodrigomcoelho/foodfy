const { Router } = require('express');
const router = Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/UserValidator');

const session = require('../app/middlewares/session');

router.get('/', UserController.index);
router.get('/create', session.isAdmin, UserController.create);
router.get('/:id/edit', session.isAdmin, UserValidator.edit, UserController.edit);
router.get('/:id', UserController.show);

router.use(session.isAdmin);

router.post('/', UserValidator.post, UserController.post);
router.put('/', UserValidator.put, UserController.put);
router.delete('/', UserValidator.delete, UserController.delete);

module.exports = router;