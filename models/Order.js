const bookshelf = require('../db');

const Order = bookshelf.model('Order', {
    tableName: 'Order',
    status() {
        return this.belongsTo('OrderStatus', 'status_id');
    },
    products() {
        return this.belongsToMany('Product', 'Order_Product', 'order_id', 'product_id').withPivot(['quantity']);
    },
});

module.exports = Order;
