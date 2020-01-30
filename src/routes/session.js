const { Router } = require('express');
const router = Router();

const SessionController = require('../app/controllers/SessionController');

router.get('/new-password', SessionController.newPassword);
router.get('/login', SessionController.loginIndex);
router.post('/password-reset', SessionController.resetPassword);
router.post('/login', SessionController.login);

module.exports = router;