const { Router } = require('express');
const router = Router();

const HomeController = require('../app/controllers/HomeController');

router.get('/recipes', HomeController.search);
router.get('/chefs', HomeController.showingChef);
router.get('/', HomeController.index);
router.get('/:id', HomeController.show);

module.exports = router;