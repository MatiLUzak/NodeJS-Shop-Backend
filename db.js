const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
