import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nawigacja from './components/Nawigacja';
import Logowanie from './components/Logowanie';
import Profil from './components/Profil';
import Lekarze from "./components/Lekarze";
import Rejestracja from "./components/Rejestracja"
import Pacjenci from "./components/Pacjenci";
import Pacjent from "./components/Pacjent";
import Choroby from "./components/Choroby";
import Uzytkownicy from "./components/Uzytkownicy";
import Choroba from "./components/Choroba";
import NieZnaleziono from "./components/NieZnaleziono";
import Archiwum from "./components/Archiwum";
import BrakDostepu from "./components/BrakDostepu";
import StronaGlowna from "./components/StronaGlowna";

const App = () => {
    return (
        <Router>
            <div>
                <Nawigacja />
                <Routes>
                    <Route path="/" element={<StronaGlowna/>}/>
                    <Route path="/brak-dostepu" element={<BrakDostepu/>} />
                    <Route path="/zaloguj" element={<Logowanie />} />
                    <Route path="/uzytkownik/:userId" element={<Profil />} />
                    <Route path="/lekarze" element={<Lekarze />} />
                    <Route path ="/rejestracja" element={<Rejestracja/>}/>
                    <Route path="/pacjenci" element={<Pacjenci/>}/>
                    <Route path="/pacjent/:identyfikator" element ={<Pacjent/>} />
                    <Route path="/choroby" element ={<Choroby/>} />
                    <Route path="/uzytkownicy" element={<Uzytkownicy/>} />
                    <Route path="/choroby/:id" element={<Choroba/>} />
                    <Route path="/archiwum" element={<Archiwum/>} />
                    <Route path="/*" element={<NieZnaleziono/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
