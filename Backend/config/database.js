const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'dbName',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą:', err.stack);
        return;
    }
    console.log('Połączono z bazą danych, id wątku: ' + connection.threadId);
});

module.exports = connection;
