const jwt = require('jsonwebtoken');

const SECRET_KEY = 'QQTech6@2024#';

const authorize = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) { 
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user;
        next();
    });
};

module.exports = authorize;
