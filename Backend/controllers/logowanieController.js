const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { czyUzytkownikIstnieje, czyPacjent, czyLekarz } = require('../controllers/uzytkownikController');

const SEKRET_JWT = 'sekretJWT';
const logowanie = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id, haslo } = req.body;

    try {
        const uzytkownik = await czyUzytkownikIstnieje(id);

        if (!uzytkownik) {
            return res.status(401).json({ error: 'Nieprawidłowe ID' });
        }

        if (id==='1')
        {
            if (haslo!==uzytkownik.Haslo)
            {
                return res.status(401).json({ error: 'Nieprawidłowe Haslo' });
            }
        }
        else
        {
            const isMatch = await bcrypt.compare(haslo, uzytkownik.Haslo);
            if (!isMatch) {
                return res.status(401).json({message: 'Niepoprawne hasło'});
            }
        }



        if (id === "1") {
            rola = 'admin';
        } else if (await czyPacjent(id)) {
            rola = 'pacjent';
        } else if (await czyLekarz(id)) {
            rola = 'lekarz';
        } else {
            rola = 'zalogowany';
        }

        const token = jwt.sign({ id,rola }, SEKRET_JWT, { expiresIn: '5h' });

        res.json({
            token,
            rola,
            userId: id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
};

module.exports = { logowanie };
