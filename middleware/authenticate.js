const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Brak nagłówka Authorization' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Brak tokenu' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Nieprawidłowy token' });
    }
};
