const bookshelf = require('../db');

const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'OrderStatus',
    orders() {
        return this.hasMany('Order', 'status_id');
    },
});

module.exports = OrderStatus;
