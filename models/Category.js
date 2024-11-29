const bookshelf = require('../db');

const Category = bookshelf.model('Category', {
    tableName: 'Category',
    products() {
        return this.hasMany('Product', 'category_id');
    },
});

module.exports = Category;