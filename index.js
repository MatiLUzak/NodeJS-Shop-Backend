require('dotenv').config();
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const statusRoutes = require('./routes/status');
const initRoutes = require('./routes/init');

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/status', statusRoutes);
app.use('/', authRoutes);
app.use('/', initRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Coś poszło nie tak!' });
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
