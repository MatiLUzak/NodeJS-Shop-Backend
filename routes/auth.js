const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowe dane rejestracji' });
    }

    try {
        const existingUser = await User.where('username', username).fetch({ require: false });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'Użytkownik o podanej nazwie już istnieje' });
        }

        const userRole = await Role.where('name', role).fetch({ require: false });
        if (!userRole) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowa rola użytkownika' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new User({
            username,
            password: hashedPassword,
            role_id: userRole.get('id'),
        }).save();

        res.status(StatusCodes.CREATED).json({ message: 'Użytkownik zarejestrowany pomyślnie' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nieprawidłowe dane logowania' });
    }

    try {
        const user = await User.where('username', username).fetch({ withRelated: ['role'], require: false });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Nieprawidłowe dane uwierzytelniające' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.get('password'));
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Nieprawidłowe dane uwierzytelniające' });
        }

        const token = jwt.sign(
            {
                userId: user.get('id'),
                role: user.related('role').get('name'),
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = router;
