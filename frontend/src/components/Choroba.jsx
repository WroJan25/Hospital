import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/Choroba.css';

const Choroba = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [choroba, setChoroba] = useState(null);
    const [ksiazeczka, setKsiazeczka] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        Id: '',
        Nazwa: '',
        Symptomy: '',
        Skala_Zakaznosci: ''
    });
    const loggedUserRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (loggedUserRole !== "lekarz" && loggedUserRole !== "admin") {
            setError("Brak dostępu do zasobu");
            window.location.href = "/brak-dostepu";
        }
        const fetchChoroba = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:3000/choroby/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                console.log(data);
                setChoroba(data.choroba);
                setKsiazeczka(Array.isArray(data.ksiazeczka)? data.ksiazeczka:(data.ksiazeczka?[data.ksiazeczka]:[]));
                console.log(data.ksiazeczka);
                console.log(ksiazeczka);
                setFormData({
                    Id: data.choroba.Id,
                    Nazwa: data.choroba.Nazwa,
                    Symptomy: data.choroba.Symptomy,
                    Skala_Zakaznosci: data.choroba.Skala_Zakaznosci
                });
            } catch (err) {
                setError('Nie udało się pobrać danych.');
                console.error("Błąd podczas pobierania danych: ", err);
            }
        };
        fetchChoroba();
    }, [id, editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            if (formData.Skala_Zakaznosci <= 0) formData.Skala_Zakaznosci = null;
            await axios.put(`http://localhost:3000/choroby/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(formData);
            setEditMode(false);
            alert('Dane zostały zaktualizowane!');
        } catch (err) {
            setError('Nie udało się zaktualizować danych.');
        }
    };

    if (!choroba) {
        return <div className="loading">Ładowanie...</div>;
    }

    return (
        <div className="choroba-container">
            <h2 className="choroba-title">Szczegóły Choroby</h2>
            <p><strong>Id:</strong> {choroba.Id}</p>
            {!editMode ? (
                <div className="choroba-details">
                    <p><strong>Nazwa:</strong> {choroba.Nazwa}</p>
                    <p><strong>Symptomy:</strong> {choroba.Symptomy}</p>
                    {(choroba.Skala_Zakaznosci &&
                        <p><strong>Skala Zakaźności:</strong> {choroba.Skala_Zakaznosci}</p>
                    )}
                    {loggedUserRole === 'admin' && (
                        <button className="button edit-button" onClick={() => setEditMode(true)}>Edytuj</button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="choroba-form">
                    <div>
                        <label>Nazwa:</label>
                        <input
                            type="text"
                            name="Nazwa"
                            value={formData.Nazwa}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Symptomy:</label>
                        <textarea
                            name="Symptomy"
                            value={formData.Symptomy}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Skala Zakaźności:</label>
                        <input
                            type="number"
                            name="Skala_Zakaznosci"
                            value={formData.Skala_Zakaznosci}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type="submit" className="button save-button">Zapisz zmiany</button>
                        <button type="button" className="button cancel-button" onClick={() => setEditMode(false)}>Anuluj</button>
                    </div>
                </form>
            )}

            <h3>Książeczki zdrowia powiązane z tą chorobą</h3>
            { ksiazeczka.length>1 ?(
                <table className="choroba-table">
                    <thead>
                    <tr>
                        <th>Imię Pacjenta</th>
                        <th>Nazwisko Pacjenta</th>
                        <th>Data wykrycia</th>
                        <th>Imię Lekarza</th>
                        <th>Nazwisko Lekarza</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ksiazeczka.map((wpis, index) => (
                        <tr key={index}>
                            <td>{wpis.imie}</td>
                            <td>{wpis.Nazwisko}</td>
                            <td>{new Date(wpis.Wykrycie).toLocaleDateString()}</td>
                            <td>{wpis.Imie_Lekarza}</td>
                            <td>{wpis.Nazwisko_Lekarza}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) :
                (
                <p>Brak książeczek zdrowia powiązanych z tą chorobą.</p>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Choroba;
