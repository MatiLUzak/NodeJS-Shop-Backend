const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

knex.raw('SELECT 1+1 AS result')
    .then((result) => {
        console.log('Połączenie z bazą danych działa poprawnie:', result[0]);
        knex.destroy();
    })
    .catch((err) => {
        console.error('Błąd połączenia z bazą danych:', err);
        knex.destroy();
    });
