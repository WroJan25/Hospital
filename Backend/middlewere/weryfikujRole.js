const jwt = require('jsonwebtoken');

const SEKRET_JWT = 'sekretJWT';

/**
 * @param {Array<string>} dozwoloneRole
 */
const weryfikujRole = (dozwoloneRole) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
        }
        try {
            const decoded = jwt.verify(token, SEKRET_JWT);
            if (!dozwoloneRole.includes(decoded.rola)) {

                return res.status(403).json({ error: 'Brak odpowiednich uprawnień' });

            }


            req.uzytkownik = decoded;
            next();
        } catch (error) {
            console.error('Błąd weryfikacji tokenu:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token wygasł' });
            }
            res.status(401).json({ error: 'Nieprawidłowy token' });

        }
    };
};

module.exports = weryfikujRole;
