const db = require("../config/database");

exports.getAllSpcejcalizacje=async (req, res) => {
    const query = "select * from specjalizacja";
    const [results] = await db.promise().query(query);
    res.json(results);
}

