const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const authenticate = require('../middleware/authenticate');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.fetchAll({ withRelated: ['status', 'products'] });
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

router.get('/status/:id', async (req, res) => {
    try {
        const orders = await Order.where('status_id', req.params.id).fetchAll({ withRelated: ['status', 'products'] });
        res.json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { user_name, email, phone_number, products } = req.body;

    if (!user_name || !email || !phone_number || !Array.isArray(products) || products.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowe dane zamówienia' });
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone_number)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowy numer telefonu' });
    }

    try {
        for (const item of products) {
            if (!item.product_id || !item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowe dane produktów w zamówieniu' });
            }

            const productExists = await Product.where('id', item.product_id).fetch();
            if (!productExists) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: `Produkt o ID ${item.product_id} nie istnieje` });
            }
        }

        const order = await new Order({
            approval_date: null,
            status_id: 1,
            user_name,
            email,
            phone_number,
        }).save();

        await order.products().attach(
            products.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            }))
        );

        res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

router.patch('/:id',authenticate, async (req, res) => {
    if (req.user.role !== 'PRACOWNIK') {
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Brak uprawnień' });
    }
    const { status_id } = req.body;

    if (!status_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Brak statusu zamówienia' });
    }

    try {
        const order = await Order.where('id', req.params.id).fetch({ withRelated: ['status'] });

        const currentStatus = order.related('status').get('name');

        if (currentStatus === 'ANULOWANE') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nie można zmienić statusu anulowanego zamówienia' });
        }

        const allowedTransitions = {
            NIEZATWIERDZONE: ['ZATWIERDZONE', 'ANULOWANE'],
            ZATWIERDZONE: ['ZREALIZOWANE', 'ANULOWANE'],
            ZREALIZOWANE: [],
            ANULOWANE: [],
        };

        const newStatus = await OrderStatus.where('id', status_id).fetch();
        const newStatusName = newStatus.get('name');

        if (!allowedTransitions[currentStatus].includes(newStatusName)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: `Nie można zmienić statusu z ${currentStatus} na ${newStatusName}` });
        }

        await order.save({ status_id });
        res.json(order);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Zamówienie nie znalezione' });
    }
});

module.exports = router;
