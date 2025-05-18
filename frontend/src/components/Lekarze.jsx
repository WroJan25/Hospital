import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Lekarze.css'; 

const Lekarze = () => {
    const [lekarze, setLekarze] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLekarze = async () => {
            try {
                const response = await axios.get('http://localhost:3000/lekarz');
                setLekarze(response.data);
            } catch (err) {
                console.error('Błąd przy pobieraniu lekarzy: ', err);
                setError('Nie udało się pobrać listy lekarzy.');
            }
        };

        fetchLekarze();
    }, []);

    if (error) {
        return <div className="lekarzeBlad">{error}</div>;
    }

    if (lekarze.length === 0) {
        return <div className="lekarzeBrak">Brak lekarzy do wyświetlenia.</div>;
    }

    return (
        <div className="lekarzeKontener">
            <h2 className="lekarzeTytul">Lista lekarzy</h2>
            <ul className="lekarzeLista">
                {lekarze.map((lekarz) => (
                    <li key={lekarz.Identyfikator} className="lekarzeElement">
                        <p><strong>Imię:</strong> {lekarz.Imie}</p>
                        <p><strong>Nazwisko:</strong> {lekarz.Nazwisko}</p>
                        <p><strong>Specjalizacja:</strong> {lekarz.Nazwa_Specjalizacji}</p>
                        <p><strong>Data zatrudnienia:</strong> {new Date(lekarz.Data_Zatrudnienia).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Lekarze;
