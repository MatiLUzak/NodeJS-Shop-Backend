const bookshelf = require('../db');

const Role = bookshelf.model('Role', {
    tableName: 'Roles',
    users() {
        return this.hasMany('User', 'role_id');
    },
});

module.exports = Role;
