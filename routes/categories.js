const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { StatusCodes } = require('http-status-codes');

// Pobranie wszystkich kategorii
router.get('/', async (req, res) => {
    try {
        const categories = await Category.fetchAll();
        res.json(categories);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;
