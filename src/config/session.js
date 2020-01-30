const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');

module.exports = session(
{
    store: new pgSession({ pool: db }),
    secret: '6aad5d70174f92779f6138005f276418',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
});