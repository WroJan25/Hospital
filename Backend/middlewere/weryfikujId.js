const jwt = require('jsonwebtoken');

const SEKRET_JWT = 'sekretJWT';


const weryfikujId = () => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
        }

        try {
            const decoded = jwt.verify(token, SEKRET_JWT);
            req.uzytkownik = decoded;
            const userIdFromParams = req.params.id;
            if (decoded.rola === 'admin' || decoded.id === userIdFromParams) {
                return next();
            }

            return res.status(403).json({ error: 'Brak odpowiednich uprawnień do wykonania tej operacji' });
        } catch (error) {
            console.error('Błąd weryfikacji tokenu:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token wygasł' });
            }
            res.status(401).json({ error: 'Nieprawidłowy token' });
        }
    };
};

module.exports = weryfikujId;
