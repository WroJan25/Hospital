const db = require('../config/database');
const bcrypt = require('bcryptjs');
exports.getAllUzytkownicy = (req, res) =>
{
    const query = 'SELECT * FROM UZYTKOWNIK';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych:', err);
            res.status(500).send("Błąd serwera");
            return;
        }
        res.json(result);
    })
}

exports.getUzytkownikById =  async (req, res) => {

    const { id } = req.params;
    const queryUser = 'SELECT Id, Imie, Nazwisko, Email, Pesel,Haslo FROM Uzytkownik WHERE Id = ?';
    const queryKsiazeczkaZdrowia = 'SELECT * FROM Ksiazeczka_Zdrowia k join Choroby c on c.id = k.Choroby_Id join uzytkownik l on l.id = k.Lekarz_Id_Lekarza Where Pacjent_Id_Pacjenta = ?';

    try {
        const [userResults] = await db.promise().query(queryUser, [id]);
        if (userResults.length <= 0) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        const userData = userResults[0];
        const queryLekarz = 'SELECT * FROM Lekarz  join specjalizacja s on s.id = Specjalizacja_Lekarza where Id_Lekarza = ?';
        const [lekarzResults] = await db.promise().query(queryLekarz, [id]);
        const queryPacjent='Select * from Pacjent where ID_Pacjenta = ?';
        const [pacjentResults] = await db.promise().query(queryPacjent, [id]);
        let additionalData = null;
        if (lekarzResults.length > 0) {
            additionalData = { rola: 'lekarz', daneLekarza: lekarzResults[0] };
        }
        else if (pacjentResults.length > 0)
        {
            const [ksiazeczkaResults] = await db.promise().query(queryKsiazeczkaZdrowia, [id]);
            if (ksiazeczkaResults.length > 0) {
                additionalData = { rola: 'pacjent', ksiazkaZdrowia: ksiazeczkaResults };
            }
            else additionalData={rola: 'pacjent'}
        }
        res.json({ userData, additionalData });

    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send("Błąd serwera");
    }
}

exports.czyUzytkownikIstnieje=async (id) => {
    const query = 'SELECT * FROM Uzytkownik where Id = ?';
    const [results] = await db.promise().query(query, [id]);
    return results[0];
}
exports.czyLekarz= async (id) => {

    const query = 'SELECT * FROM lekarz where Id_Lekarza = ?';
    const [results] = await db.promise().query(query, [id]);
    return results[0];
}

exports.czyPacjent = async (id) => {
    const query = 'SELECT * FROM Pacjent where Id_Pacjenta = ?';
    const [results] = await db.promise().query(query, [id]);
    return results[0];
}

exports.addUzytkownik = async (req, res) => {
    const {Imie, Nazwisko, Email, Pesel, Haslo} = req.body;


    try {
        const hashedPassword = await bcrypt.hash(Haslo, 10);
        const queryE = 'Select * from Uzytkownik where Email = ?';
        const [resultE] = await db.promise().query(queryE, [Email]);
        if (resultE.length > 0) {
            return res.status(400).json({ message: 'Ten e-mail jest już używany' });

        }
        const query = 'INSERT INTO Uzytkownik (Imie, Nazwisko, Email, Pesel, Haslo) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [Imie, Nazwisko, Email, Pesel, hashedPassword]);
        const userId = result.insertId;

        res.status(201).json({ message: 'Użytkownik został dodany', id: userId });
    } catch (err) {
        console.error('Błąd przy dodawaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
};

exports.deleteUzytkownik = async (req, res) => {
    const {id} = req.params;
    try {
        const query_KP = 'DELETE FROM KSIAZECZKA_ZDROWIA WHERE PACJENT_Id_Pacjenta = ?';
        await db.promise().query(query_KP, [id]);
        const query_KL = 'DELETE FROM KSIAZECZKA_ZDROWIA WHERE LEKARZ_ID_LEKARZA = ?';
        await db.promise().query(query_KL, [id]);
        const query_P = 'DELETE FROM PACJENT WHERE Id_Pacjenta = ?';
        await db.promise().query(query_P, [id]);
        const query_L = 'DELETE FROM LEKARZ WHERE Id_Lekarza = ?';
        await db.promise().query(query_L, [id]);
        const query = 'DELETE FROM UZYTKOWNIK WHERE Id = ?';
        const [results] = await db.promise().query(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({message: 'Nie znaleziono Uzytkownika o podanym Id'});
        }
        res.json({message: `Uzytkownik o id ${id}, został usunięty`});
    } catch (err) {
        console.error('Błąd przy usuwaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
}
exports.updateUzytkownik = async (req, res) => {
    const {id} = req.params;
    const {Imie, Nazwisko, Email, Pesel, Haslo} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Haslo, 10);
        const queryE = 'Select * from Uzytkownik where Email = ?';
        const [resultE] = await db.promise().query(queryE, [Email]);
        if (resultE.length > 1) {
            return res.status(400).json({message: 'Ten e-mail jest już używany'});
        }
        const query = `UPDATE Uzytkownik SET Imie = ?, Nazwisko = ?, Email = ?, Pesel = ?, Haslo = ? WHERE id = ?`;
        const [result] = await db.promise().query(query, [Imie, Nazwisko, Email, Pesel, hashedPassword, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym id' });
        }
        res.json({ message: `Użytkownik o id ${id} został zaktualizowany` });
    } catch (err) {
        console.error('Błąd przy aktualizacji danych:', err);
        res.status(500).send('Błąd serwera');
    }
};