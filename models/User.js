const bookshelf = require('../db');

const User = bookshelf.model('User', {
    tableName: 'Users',
    role() {
        return this.belongsTo('Role', 'role_id');
    },
});

module.exports = User;
