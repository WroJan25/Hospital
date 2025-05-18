const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chorobyRoutes = require('./routes/choroby');
const uzytkownikRoutes = require('./routes/uzytkownik');
const ksiazeczkaZdrowiaRoutes = require('./routes/ksiazeczkaZdrowia');
const lekarzRoutes = require('./routes/lekarz');
const pacjentRoutes = require('./routes/pacjent');
const logowanieRoutes = require('./routes/logowanie');
const specjalizacjaRoutes = require('./routes/specjalizacja');
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/choroby', chorobyRoutes);
app.use('/uzytkownik', uzytkownikRoutes);
app.use('/ksiazeczkaZdrowia',ksiazeczkaZdrowiaRoutes)
app.use('/lekarz', lekarzRoutes);
app.use('/pacjent', pacjentRoutes);
app.use('/logowanie', logowanieRoutes);
app.use('/specjalizacja', specjalizacjaRoutes);
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
