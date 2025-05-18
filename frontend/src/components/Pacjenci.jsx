import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Pacjenci.css';

const Pacjenci = () => {
    const [pacjenci, setPacjenci] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUserRole = localStorage.getItem('userRole');

        if (loggedUserRole !== "lekarz" && loggedUserRole !== "admin") {
            setError("Brak dostępu do zasobu");
            window.location.href = "/brak-dostepu";
            return;
        }

        const fetchPacjenci = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/pacjent', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPacjenci(response.data);
            } catch (err) {
                console.error('Błąd przy pobieraniu pacjentów: ', err);
                setError('Nie udało się pobrać listy pacjentów.');
            }
        };

        fetchPacjenci();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (pacjenci.length === 0) {
        return <div className="info-message">Brak pacjentów do wyświetlenia.</div>;
    }

    const szczegolyPacjenta = (identyfikator) => {
        navigate(`/pacjent/${identyfikator}`);
    };

    return (
        <div className="pacjenci-container">
            <h2 className="pacjenci-title">Lista Pacjentów</h2>
            <ul className="pacjenci-list">
                {pacjenci.map((pacjent) => (
                    <li key={pacjent.Identyfikator} className="pacjent-item">
                        <div className="pacjent-info">
                            <p><strong>Imię:</strong> {pacjent.Imie}</p>
                            <p><strong>Nazwisko:</strong> {pacjent.Nazwisko}</p>
                            <p><strong>Pesel:</strong> {pacjent.Pesel}</p>
                            <p><strong>Email:</strong> {pacjent.Email}</p>
                        </div>
                        <button
                            className="button szczegoly-button"
                            onClick={() => szczegolyPacjenta(pacjent.Identyfikator)}
                        >
                            Szczegóły
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Pacjenci;
