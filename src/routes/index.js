const { Router } = require('express');
const routes = Router();

const home = require('./home');
const admin = require('./admin');
const session = require('./session');


routes.use('/home', home);
routes.use('/admin', admin);
routes.use('/session', session);

routes.get('/', (req, res) => res.redirect('/home'));
routes.get('/chefs', (req, res) => res.redirect('/admin/chefs'));

module.exports = routes;