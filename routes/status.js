const express = require('express');
const router = express.Router();
const OrderStatus = require('../models/OrderStatus');
const { StatusCodes } = require('http-status-codes');

router.get('/', async (req, res) => {
    try {
        const statuses = await OrderStatus.fetchAll();
        res.json(statuses);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;
