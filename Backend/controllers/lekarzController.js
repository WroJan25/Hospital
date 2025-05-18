const db = require("../config/database");
exports.getAllLekarze = (req, res) =>
{
    const query = 'Select Identyfikator,Imie, Nazwisko, Nazwa_Specjalizacji, Data_Zatrudnienia from Lekarz left join uzytkownik on Lekarz.Id_Lekarza = uzytkownik.id join specjalizacja s on s.Id = Lekarz.Specjalizacja_lekarza order by specjalizacja_lekarza';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Błąd przy pobieraniu danych:', err);
            res.status(500).send("Błąd serwera");
            return;
        }
        res.json(result);
    })
}

exports.getLekarzById = async (req, res) => {
    const {id} = req.params;
    const query = 'Select Identyfikator,Nazwisko, Nazwa_Specjalizacji, Data_Zatrudnienia from Lekarz left join uzytkownik on Lekarz.Id_Lekarza = uzytkownik.id join specjalizacja s on s.Id = Lekarz.Specjalizacja_lekarza where id_lekarza=?';
    try {
        const [results] = await db.promise().query(query, [id]);
        if (results.length <= 0) {
            return res.status(404).json({message: 'Uzytkownik nie został znaleziony'});
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Błąd przy pobieraniu danych:', err);
        res.status(500).send("Błąd serwera");
    }
}

exports.addLekarz = async (req, res) => {

    const {id} = req.params;
    const queryFindUser = 'SELECT * FROM UZYTKOWNIK WHERE Id = ?';
    const [finder] = await db.promise().query(queryFindUser, [id]);
    if (finder.length <= 0) {
        return res.status(404).json({message: 'Uzytkownik nie znajduje się w systemie'});
    }
    try {
        const {Data_Zatrudnienia,Specjalizacja_Lekarza } = req.body;
        const queryMaxId = 'SELECT MAX(identyfikator) AS maxId FROM Lekarz';
        const [maxIdResult] = await db.promise().query(queryMaxId);
        const nextId = (maxIdResult[0].maxId || 1000) + 1;
        const query_add = 'Insert into Lekarz (Id_Lekarza, Identyfikator,Data_Zatrudnienia,Specjalizacja_Lekarza) Values (?,?,?,?) ';
        await db.promise().query(query_add, [id, nextId, Data_Zatrudnienia, Specjalizacja_Lekarza]);
        res.status(201).json({
            message: 'Użytkownik został dodany do grupy lekarzy',});
    } catch (err) {
        console.error('Błąd przy dodawaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }

}
exports.deleteLekarz = async (req,res) => {
    const {id} = req.params;
    const query_K = "DELETE FROM Ksiazeczka_Zdrowia WHERE Lekarz_Id_Lekarza = ?";
    await db.promise().query(query_K, [id]);
    try {
    const query = "Delete from lekarz where Id_Lekarza = ?";
    const [result] = await db.promise().query(query,[id]);
    if (result.affectedRows <0) {return res.status(404).json({message:`Lekarz o id ${id} nie znajduje się w systemie`})}
        res.status(201).json({
            message: `Lekarz o id ${id} został usunięty`
        });

    } catch (err) {
        console.error('Błąd przy usuwaniu danych:', err);
        res.status(500).send('Błąd serwera');
    }
}
exports.updateLekarz = async (req,res)=>
{
    const {id}=req.params;
    const {specjalizacja_Lekarza,data_zatrudnienia} = req.body;
    const queryL = 'select * from lekarz where Id_Lekarza = ?';
    const [resultL] = await db.promise().query(queryL, [id]);
    console.log(resultL.length);
    if (resultL.length<=0) return res.status(404).json({messege: `Lekarz o ${id} nie istnieje`})
    try {
        const query = `Update Lekarz set Data_Zatrudnienia = ?,Specjalizacja_lekarza=? where Id_Lekarza = ?`;
        await db.promise().query(query,[data_zatrudnienia,specjalizacja_Lekarza,id]);
        console.log("2")
    }catch(err) {
        res.status(500).send('Błąd serwera');
    }
}
