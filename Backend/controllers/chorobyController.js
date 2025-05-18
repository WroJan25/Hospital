const db = require('../config/database');
const {getKsiazeczkaByChorobaId} = require("./ksiazeczkaZdrowiaController");

exports.getAllChoroby = async (req, res) => {
    const query = 'SELECT * FROM Choroby';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych:', err);
            res.status(500).send('Błąd serwera');
            return;
        }
        res.json(results);
    });
};

exports.getChorobaById = async (req, res) => {
    const { id } = req.params;
    const queryChoroba = 'SELECT * FROM Choroby WHERE Id = ?';

    try {
        const [chorobaResults] = await db.promise().query(queryChoroba, [id]);
        if (chorobaResults.length === 0) {
            return res.status(404).json({ message: 'Choroba nie została znaleziona' });
        }

        const ksiazeczkaResults=  await getKsiazeczkaByChorobaId(id);
        res.json({
            choroba: chorobaResults[0],
            ksiazeczka: ksiazeczkaResults
        });
    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
};



exports.addChoroba = async (req, res) => {
    const {Nazwa, Symptomy, Skala_Zakaznosci} = req.body;
    if (typeof Nazwa !== 'string' || Nazwa.length > 100 || !Symptomy || Symptomy.length > 500) {
        return res.status(400).json({error: 'Niepoprawne dane wejściowe'});
    }
    const queryN = 'Select * from choroby where Nazwa = ?';
    const [resultN] = await db.promise().query(queryN, [Nazwa]);
    if (resultN.length >0)
    {
        res.status(404).send("Choroba o podanej nazwie już znajduje się w bazie")
        return;
    }
    const query = 'INSERT INTO Choroby (Nazwa, Symptomy, Skala_Zakaznosci) VALUES (?, ?, ?)';
    db.query(query, [Nazwa, Symptomy, Skala_Zakaznosci], (err, results) => {
        if (err) {
            console.error('Błąd przy dodawaniu danych:', err);
            res.status(500).send('Błąd serwera');
            return;
        }
        res.status(201).json({message: 'Choroba dodana', id: results.insertId});
    });
};


exports.putChoroba = async (req, res) => {
    const {id} = req.params;
    const {Nazwa, Symptomy, Skala_Zakaznosci} = req.body;
    if (typeof Nazwa !== 'string' || Nazwa.length > 100 || !Symptomy || Symptomy.length > 500) {
        return res.status(400).json({error: 'Niepoprawne dane wejściowe'});
    }
    const query = `UPDATE Choroby SET Nazwa = ?, Symptomy = ?, Skala_Zakaznosci = ? WHERE Id = ?`;
    db.query(query, [Nazwa, Symptomy, Skala_Zakaznosci, id], (err, results) => {
        if (err) {
            console.error('Błąd przy aktualizowaniu danych:', err);
            return res.status(500).send('Błąd serwera');
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({message: 'Nie znaleziono choroby o podanym Id'});
        }

        res.json({message: 'Choroba zaktualizowana pomyślnie'});
    });
}

exports.deleteChoroba = async (req, res) => {
    const {id} = req.params;
    try {
    const query_K ='DELETE FROM KSIAZECZKA_ZDROWIA where Choroby_Id=?';
    await db.promise().query(query_K, [id]);
    const query = `DELETE FROM Choroby WHERE Id = ?`;
    const [results] = await db.promise().query(query, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({message: 'Nie znaleziono choroby o podanym Id'});
        }
        res.json({message: `Choroba o id ${id}, została usunięta`});
    }catch(err) {
        console.error('Błąd przy aktualizowaniu danych:', err);
        return res.status(500).send('Błąd serwera');
    }
}

exports.getChorobaByNazwa  = async  (req, res) => {
    const {Nazwa} = req.params;
    try {
        const query ='Select * from choroba where Nazwa=?';
        const [results] = await db.promise().query(query, [Nazwa]);
        if (results.length=== 0) {
            return res.status(404).json({message:'Nie udało znaleźć się tej choroby'})

        }

    }catch(err) {
        console.error('Błąd przy pobieraniu danych', err);
        return res.status(500).send('Błąd serwera');
    }

}