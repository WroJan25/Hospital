const db = require("../config/database");
const KsiazeczkaPacjenta = require("./ksiazeczkaZdrowiaController");
exports.getAllPacjenci = (req, res) => {
    const query = 'SELECT  Identyfikator, Imie, Nazwisko, Email, Pesel, Haslo FROM Pacjent left join Uzytkownik on  pacjent.Id_Pacjenta = uzytkownik.id';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych:', err);
            res.status(500).send("Błąd serwera");
            return;
        }
        res.json(result);
    })
}

exports.getPacjentById = async (req, res) => {
    const {id} = req.params;
    const query = 'SELECT  Identyfikator, Imie, Nazwisko, Email, Pesel, Haslo FROM Pacjent left join Uzytkownik on  pacjent.Id_Pacjenta = uzytkownik.id WHERE Id_pacjenta = ?';
    try {
        const [results] = await db.promise().query(query, [id]);
        if (results.length <= 0) {
            return res.status(404).json({message: 'Pacjent nie został znaleziony'});
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send("Błąd serwera");
    }
}
exports.getPacjentByIdentyfikator = async (req, res) => {
    const {identyfikator} = req.params;

    const query = 'Select Id_Pacjenta,Identyfikator, Imie, Nazwisko, PESEL from Pacjent join uzytkownik u on Id_Pacjenta = u.id where Identyfikator = ?';
    try {
        const [results] = await db.promise().query(query, [parseInt(identyfikator, 10)]);

        if (results.length <= 0) {
            return res.status(404).json({ message: 'Pacjent nie został znaleziony' });
        }

        const queryPId = 'Select Id_Pacjenta from pacjent where Identyfikator = ?';
        const [idPResult] = await db.promise().query(queryPId, [parseInt(identyfikator, 10)]);
        const id = idPResult.length > 0 ? idPResult[0].Id_Pacjenta : null;

        const ksiazeczkaData = await KsiazeczkaPacjenta.getKsiazeczkaByPacjentId(id);

        const pacjentZKsiazeczka = {
            pacjent: results[0],
            ksiazeczka: ksiazeczkaData
        };

        res.json(pacjentZKsiazeczka);

    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send("Błąd serwera");
    }
};

exports.addPacjent = async (req, res) => {

    const {id} = req.params;
    const query = 'SELECT * FROM UZYTKOWNIK WHERE Id = ?';
    try {
        const [finder] = await db.promise().query(query, [id]);
        if (finder.length <= 0) {
            return res.status(404).json({message: 'Uzytkownik nie znajduje się w systemie'});
        }
        const queryMaxId = 'SELECT MAX(identyfikator) AS maxId FROM PACJENT';
        const [maxIdResult] = await db.promise().query(queryMaxId);
        const nextId = (maxIdResult[0].maxId || 1000) + 1;
        const query_add = 'Insert into Pacjent (Id_Pacjenta, Identyfikator) Values (?,?) ';
        const [result] = await db.promise().query(query_add, [id, nextId]);
        res.status(201).json({
            message: 'Użytkownik został dodany do grupy pacjentów',
            Identyfikator: result.Identyfikator
        });


    } catch (err) {
        console.error('Błąd przy dodawaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
}
exports.deletePacjent = async (req, res) => {
    const {id} = req.params;
    const query_KP = 'DELETE FROM KSIAZECZKA_ZDROWIA WHERE PACJENT_Id_Pacjenta = ?';
    await db.promise().query(query_KP, [id]);
    try {
        const query = 'DELETE FROM PACJENT where Id_Pacjenta =?'
        const [result] = await db.promise().query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Nie znaleziono Pacjenta o podanym Id'});
        }
        res.json({message: `Pacjent o id ${id}, został usunięty`});
    } catch (err) {
        console.error('Błąd przy usuwaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }

}