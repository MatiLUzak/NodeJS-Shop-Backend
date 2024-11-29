const express = require('express');
const app = express();
const port = 3000;

// Middleware do parsowania JSON
app.use(express.json());

// Dołączanie tras
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const statusRoutes = require('./routes/status');

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/status', statusRoutes);

// Obsługa błędów (opcjonalnie)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Coś poszło nie tak!' });
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
