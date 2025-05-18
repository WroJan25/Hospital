const db = require("../config/database");
exports.getAllKsiazeczki = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const recordsPerPage = 5;
    const offset = (page - 1) * recordsPerPage;
    const query = `
        SELECT Pacjent_Id_Pacjenta, Lekarz_Id_Lekarza, Choroby_Id, 
            p.Imie AS Pacjent_Imie, p.Nazwisko AS Pacjent_Nazwisko, 
            c.Nazwa AS Choroba_Nazwa, c.Symptomy, c.Skala_Zakaznosci, 
            ksiazeczka_zdrowia.Wykrycie, l.Imie AS Lekarz_Imie, 
            l.Nazwisko AS Lekarz_Nazwisko 
        FROM ksiazeczka_zdrowia 
        JOIN uzytkownik l ON ksiazeczka_zdrowia.Lekarz_Id_Lekarza = l.id 
        JOIN uzytkownik p ON ksiazeczka_zdrowia.Pacjent_Id_Pacjenta = p.id 
        JOIN choroby c ON c.Id = ksiazeczka_zdrowia.Choroby_Id 
        ORDER BY p.id 
        LIMIT ? OFFSET ?`;

    db.query(query, [recordsPerPage, offset], (err, result) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych:', err);
            res.status(500).send("Błąd serwera");
            return;
        }
        const countQuery = 'SELECT COUNT(*) AS wszystkieRekordy FROM ksiazeczka_zdrowia';
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error('Błąd przy liczeniu rekordów:', err);
                res.status(500).send('Błąd serwera');
                return;
            }
            const wszystkieRekordy = countResult[0].wszystkieRekordy;
            res.json({
                ksiazeczki: result,
                wszystkieRekordy: wszystkieRekordy
            });
        });
    });
};


exports.getKsiazeczkaByChorobaId = async (id) => {
    const query = `
        SELECT 
            p.imie, 
            p.Nazwisko, 
            Wykrycie, 
            l.imie AS Imie_Lekarza, 
            l.nazwisko AS Nazwisko_Lekarza 
        FROM ksiazeczka_zdrowia 
        JOIN uzytkownik p ON Pacjent_Id_Pacjenta = p.id 
        JOIN uzytkownik l ON Lekarz_Id_Lekarza = l.id 
        JOIN choroby ON ksiazeczka_zdrowia.Choroby_Id = choroby.Id 
        WHERE Choroby_Id = ?
    `;
    try {
        const [results] = await db.promise().query(query, [id]);
        return results;
    } catch (err) {
        return []
    }
};



exports.getKsiazeczkaByLekarzId = async (req, res) => {
    const {id} = req.params;
    const query = 'Select p.imie, p.Nazwisko, choroby.nazwa, choroby.Symptomy,choroby.Skala_Zakaznosci, Wykrycie from ksiazeczka_zdrowia join uzytkownik p on Pacjent_Id_Pacjenta = p.id join choroby on ksiazeczka_zdrowia.Choroby_Id = choroby.Id where Lekarz_Id_Lekarza=?';
    try {
        const [results] = await db.promise().query(query, [id]);
        if (results.length <= 0) {
            return res.status(404).json({message: 'Lekarz o podanym id nie został znaleziony'});
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send("Błąd serwera");
    }
}
exports.getKsiazeczkaByPacjentId = async (id) => {
    const query = 'Select Lekarz_Id_Lekarza,Choroby_Id,Nazwa, Symptomy, Skala_Zakaznosci, Imie, Nazwisko, Nazwa_Specjalizacji,Wykrycie from ksiazeczka_zdrowia join choroby c on c.id = Choroby_Id join lekarz l on Lekarz_Id_Lekarza = l.Id_Lekarza join specjalizacja s on l.Specjalizacja_lekarza = s.Id join uzytkownik u on l.Id_Lekarza = u.id where Pacjent_Id_Pacjenta = ? Order BY  Wykrycie desc ';
    try {
        const [results] = await db.promise().query(query, [id]);

        if (results.length <= 0) {
            return [];
        }

        return results;
    } catch (err) {
        console.error('Błąd przy pobieraniu danych książeczki zdrowia:', err);
        throw err;
    }
};
exports.deleteKsiazeczka = async (req, res) => {
    const { id_pacjenta, id_choroby, data_wykrycia, id_lekarza } = req.params;
    const query = `
        DELETE FROM ksiazeczka_zdrowia 
        WHERE Pacjent_Id_Pacjenta = ? 
          AND Choroby_Id = ? 
          AND Wykrycie = ? 
          AND Lekarz_Id_Lekarza = ?`;


    try {
        const [results] = await db.promise().query(query, [parseInt(id_pacjenta,10), parseInt(id_choroby,10), data_wykrycia, parseInt(id_lekarza,10)]);
        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: `Rekord o podanych parametrach nie został znaleziony.`,
            });
        }
        res.status(200).json({ message: "Rekord został usunięty pomyślnie." });
    } catch (err) {
        console.error("Błąd przy usuwaniu danych:", err);
        res.status(500).send("Błąd serwera");
    }
};
exports.putKsiazeczka = async (req,res) =>
{
    const {pacjent_id_pacjenta, choroby_id}= req.params;
    const {wykrycie} = req.body;
    const query = `Update Ksiazeczka_Zdrowia Set Wykrycie =? where pacjent_id_pacjenta = ?AND choroby_id = ?`;

    const [result] = await db.promise().query(query, [wykrycie, pacjent_id_pacjenta,choroby_id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({
            message: `Rekord o podanych parametrach nie został znaleziony.`,
        });
    }
    res.status(200).json({ message: "Rekord został zaktualizowany pomyślnie." });
}
exports.addKsiazeczka = async (req, res) => {
    const { pacjent_id_pacjenta, id_choroby, lekarz_id_lekarza, wykrycie } = req.body;

    try {

        const query_P = 'SELECT * FROM Pacjent WHERE ID_PACJENTA = ?';

        const [results_P] = await db.promise().query(query_P, [pacjent_id_pacjenta]);
        if (results_P.length === 0) {
            return res.status(404).json({ message: `Podany pacjent nie został znaleziony` });
        }

        const query_L = 'SELECT * FROM Lekarz WHERE ID_lekarza = ?';
        const [results_L] = await db.promise().query(query_L, lekarz_id_lekarza);
        if (results_L.length === 0) {
            return res.status(404).json({ message: `Podany lekarz nie został znaleziony` });
        }

        const query_C = 'SELECT * FROM Choroby WHERE id = ?';
        const [results_C] = await db.promise().query(query_C, [id_choroby]);
        if (results_C.length === 0) {
            return res.status(404).json({ message: `Podana choroba nie została znaleziona` });
        }

        const query = 'INSERT INTO ksiazeczka_zdrowia (pacjent_id_pacjenta, choroby_id, lekarz_id_lekarza, wykrycie) VALUES (?, ?, ?, ?)';
        await db.promise().query(query, [pacjent_id_pacjenta, id_choroby, lekarz_id_lekarza, wykrycie]);


        res.status(201).json({ message: 'Książeczka została dodana' });
    } catch (err) {
        console.error('Błąd przy dodawaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
};
