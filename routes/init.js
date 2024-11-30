const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/init', authenticate, upload.single('file'), async (req, res) => {
    if (req.user.role !== 'PRACOWNIK') {
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Brak uprawnień' });
    }

    try {
        const productCount = await Product.count();
        if (productCount > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Produkty już istnieją w bazie danych' });
        }

        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Brak pliku z danymi' });
        }

        const filePath = req.file.path;
        const products = [];

        if (req.file.mimetype === 'application/json' || req.file.originalname.endsWith('.json')) {
            const data = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(data);
            products.push(...jsonData);
        } else if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        products.push(row);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieobsługiwany format pliku' });
        }

        for (const productData of products) {
            const { name, description, unit_price, unit_weight, category_id } = productData;

            if (!name || !description || unit_price <= 0 || unit_weight <= 0 || !category_id) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowe dane produktu', product: productData });
            }

            await new Product({
                name,
                description,
                unit_price,
                unit_weight,
                category_id,
            }).save();
        }

        fs.unlinkSync(filePath);

        res.status(StatusCodes.OK).json({ message: 'Produkty zostały pomyślnie zainicjalizowane' });
    } catch (error) {
        console.error('Błąd podczas inicjalizacji produktów:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Błąd podczas inicjalizacji produktów' });
    }
});

module.exports = router;
