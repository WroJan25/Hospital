import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/Pacjent.css';

const Pacjent = () => {
    const { identyfikator } = useParams();
    const [danePacjenta, setDanePacjenta] = useState(null);
    const [choroby, setChoroby] = useState([]);
    const [wykrycie, setWykrycie] = useState('');
    const [idChoroby, setIdChoroby] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [edycjaDaty, setEdycjaDaty] = useState({});
    const lekarzId = parseInt(localStorage.getItem('userId'), 10);
    const [trybDodawania, setTrybDodawania] = useState(false);
    const loggedUserRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchPacjent = async () => {
            if (loggedUserRole !== "lekarz" && loggedUserRole !== "admin") {
                setErrorMessage("Brak dostępu do zasobu");
                window.location.href = "/brak-dostepu";
            }
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:3000/pacjent/identyfikator/${identyfikator}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDanePacjenta(response.data);
            } catch (err) {
                console.error('Błąd przy pobieraniu pacjenta: ', err);
            }
        };

        const fetchChoroby = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/choroby', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data);
                setChoroby(response.data);
            } catch (err) {
                console.error('Błąd przy pobieraniu chorób: ', err);
            }
        };

        fetchPacjent();
        fetchChoroby();
    }, [identyfikator, trybDodawania, edycjaDaty]);

    const handleAddKsiazeczka = async () => {
        if (!idChoroby || !wykrycie) {
            setErrorMessage('Proszę uzupełnić wszystkie pola.');
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(wykrycie);

        if (selectedDate > currentDate) {
            setErrorMessage('Data wykrycia nie może być w przyszłości.');
            return;
        }

        const nowaKsiazeczka = {
            pacjent_id_pacjenta: danePacjenta.pacjent.Id_Pacjenta,
            id_choroby: idChoroby,
            lekarz_id_lekarza: lekarzId,
            wykrycie,
        };

        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://localhost:3000/ksiazeczkaZdrowia', nowaKsiazeczka, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Dodano wpis do książeczki zdrowia.');
            setIdChoroby('');
            setWykrycie('');
            setTrybDodawania(false);
            setErrorMessage('');
        } catch (err) {
            console.error('Błąd przy dodawaniu książeczki zdrowia: ', err);
            setErrorMessage('Nie udało się dodać wpisu do książeczki zdrowia.');
        }
    };

    const handleEditDate = (chorobaId) => {
        setEdycjaDaty(prev => ({ ...prev, [chorobaId]: !prev[chorobaId] }));
        setErrorMessage('');
    };

    const handleSaveDate = async (pacjent_id_pacjenta, choroby_id, wykrycie) => {
        if (!wykrycie) {
            setErrorMessage('Proszę wprowadzić datę wykrycia.');
            return;
        }
        const currentDate = new Date();
        const selectedDate = new Date(wykrycie);

        if (selectedDate > currentDate) {
            setErrorMessage('Data wykrycia nie może być w przyszłości.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:3000/ksiazeczkaZdrowia/${pacjent_id_pacjenta}/${choroby_id}`, { wykrycie }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Data została zaktualizowana.');
            setEdycjaDaty(prev => ({ ...prev, [choroby_id]: false }));
            setErrorMessage('');
        } catch (err) {
            console.error('Błąd przy aktualizacji daty: ', err);
            setErrorMessage('Nie udało się zaktualizować daty.');
        }
    };

    if (!danePacjenta) {
        return <div className="loading">Ładowanie szczegółów pacjenta...</div>;
    }

    return (
        <div className="pacjent-container">
            <h2 className="title">Szczegóły Pacjenta</h2>
            <p><strong>Identyfikator:</strong> {danePacjenta.pacjent.Identyfikator}</p>
            <p><strong>Imię:</strong> {danePacjenta.pacjent.Imie}</p>
            <p><strong>Nazwisko:</strong> {danePacjenta.pacjent.Nazwisko}</p>
            <p><strong>PESEL:</strong> {danePacjenta.pacjent.PESEL}</p>

            <h3 className="subtitle">Książeczka zdrowia</h3>
            {danePacjenta.ksiazeczka.length === 0 ? (
                <p className="empty-message">Brak danych w książeczce zdrowia</p>
            ) : (
                <table className="healthbook-table">
                    <thead>
                    <tr>
                        <th>Nazwa choroby</th>
                        <th>Data wykrycia</th>
                        <th>Lekarz</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {danePacjenta.ksiazeczka.map((diagnoza) => (
                        <tr key={diagnoza.Choroby_Id}>
                            <td>{diagnoza.Nazwa}</td>
                            <td>
                                {edycjaDaty[diagnoza.Choroby_Id] && lekarzId === diagnoza.Lekarz_Id_Lekarza ? (
                                    <input
                                        type="date"
                                        className="date-input"
                                        defaultValue={new Date(diagnoza.Wykrycie).toLocaleDateString('en-CA')}
                                        onChange={(e) => setWykrycie(e.target.value)}
                                    />
                                ) : (
                                    new Date(diagnoza.Wykrycie).toLocaleDateString('en-CA')
                                )}
                            </td>
                            <td>{diagnoza.Imie} {diagnoza.Nazwisko}</td>
                            <td>
                                {lekarzId === diagnoza.Lekarz_Id_Lekarza && (
                                    edycjaDaty[diagnoza.Choroby_Id] ? (
                                        <button
                                            className="save-btn"
                                            onClick={() => handleSaveDate(danePacjenta.pacjent.Id_Pacjenta, diagnoza.Choroby_Id, wykrycie)}
                                        >
                                            Zapisz
                                        </button>
                                    ) : (
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditDate(diagnoza.Choroby_Id)}
                                        >
                                            Zmień datę
                                        </button>
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {localStorage.getItem('userRole') === 'lekarz' && !trybDodawania && (
                <button className="add-btn" onClick={() => setTrybDodawania(true)}>Dodaj Nową Diagnozę</button>
            )}
            {trybDodawania && (
                <div className="add-diagnosis-form">
                    <h3>Dodaj nową chorobę</h3>
                    <div>
                        <label>
                            Wybierz chorobę:
                            <select
                                value={idChoroby}
                                onChange={(e) => setIdChoroby(e.target.value)}
                                className="select-input"
                            >
                                <option value="">Wybierz chorobę</option>
                                {choroby.map((choroba) => (
                                    <option key={choroba.Id} value={choroba.Id}>
                                        {choroba.Nazwa}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Data wykrycia:
                            <input
                                type="date"
                                className="date-input"
                                value={wykrycie}
                                onChange={(e) => setWykrycie(e.target.value)}
                            />
                        </label>
                        <button className="save-btn" onClick={handleAddKsiazeczka}>Dodaj do książeczki</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pacjent;
