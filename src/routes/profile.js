const { Router } = require('express');
const router = Router();

const ProfileController = require('../app/controllers/ProfileController');

router.get('/', ProfileController.index);

module.exports = router;