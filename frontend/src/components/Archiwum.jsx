import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paginacja from './Paginacja';
import '../styles/Archiwum.css';

const Archiwum = () => {
    const [ksiazeczki, setKsiazeczki] = useState([]);
    const [error, setError] = useState(null);
    const [usunieto, setUsunieto] = useState(false);
    const [wszystkieRekordy, setWszystkieRekordy] = useState(0);
    const [strona, setStrona] = useState(1);

    useEffect(() => {
        if (localStorage.getItem('userRole') !== 'admin') {
            setError("Brak dostępu do zasobu");
            window.location.href = "/brak-dostepu";
        }

        const fetchKsiazeczki = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:3000/ksiazeczkaZdrowia?page=${strona}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setKsiazeczki(response.data.ksiazeczki || []);
                setWszystkieRekordy(response.data.wszystkieRekordy || 0);
            } catch (err) {
                console.error('Nie udało się pobrać danych:', err);
                setError("Nie udało się pobrać danych.");
            }
        };

        fetchKsiazeczki();
    }, [strona, usunieto]);

    const deleteKsiazeczka = async (idPacjenta, idChoroby, dataWykrycia, idLekarza) => {
        try {
            const token = localStorage.getItem('authToken');
            const wykrycie = new Date(dataWykrycia).toLocaleDateString('en-CA');
            await axios.delete(
                `http://localhost:3000/ksiazeczkaZdrowia/${idPacjenta}/${idChoroby}/${wykrycie}/${idLekarza}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (ksiazeczki.length % 5 === 1 && strona > 1) {
                handleStronaChange(strona - 1);
            }

            setUsunieto(prevState => !prevState);
        } catch (err) {
            console.error("Nie udało się usunąć rekordu:", err);
            alert("Nie udało się usunąć rekordu.");
        }
    };

    const handleStronaChange = (strona) => {
        if (strona > 0 && strona <= Math.ceil(wszystkieRekordy / 5)) {
            setStrona(strona);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (ksiazeczki.length === 0) {
        return <h1>Brak Rekordów w archiwum</h1>;
    }

    return (
        <div className="archiwum-container">
            <h1 className="title">Archiwum Książeczek Zdrowia</h1>
            <table className="ksiazeczki-table">
                <thead>
                <tr>
                    <th>Imię Pacjenta</th>
                    <th>Nazwisko Pacjenta</th>
                    <th>Nazwa Choroby</th>
                    <th>Symptomy</th>
                    <th>Skala Zakaźności</th>
                    <th>Data Wykrycia</th>
                    <th>Imię Lekarza</th>
                    <th>Nazwisko Lekarza</th>
                    <th>Akcja</th>
                </tr>
                </thead>
                <tbody>
                {ksiazeczki.map((ksiazeczka, index) => (
                    <tr key={index}>
                        <td>{ksiazeczka.Pacjent_Imie}</td>
                        <td>{ksiazeczka.Pacjent_Nazwisko}</td>
                        <td>{ksiazeczka.Choroba_Nazwa}</td>
                        <td>{ksiazeczka.Symptomy}</td>
                        <td>{ksiazeczka.Skala_Zakaznosci ?? "brak"}</td>
                        <td>{new Date(ksiazeczka.Wykrycie).toLocaleDateString()}</td>
                        <td>{ksiazeczka.Lekarz_Imie}</td>
                        <td>{ksiazeczka.Lekarz_Nazwisko}</td>
                        <td>
                            <button
                                onClick={() =>
                                    deleteKsiazeczka(
                                        ksiazeczka.Pacjent_Id_Pacjenta,
                                        ksiazeczka.Choroby_Id,
                                        ksiazeczka.Wykrycie,
                                        ksiazeczka.Lekarz_Id_Lekarza
                                    )
                                }
                                className="delete-btn"
                            >
                                Usuń
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Paginacja
                wszystkieRekordy={wszystkieRekordy}
                rekordyNaStrone={5}
                onStronaChange={handleStronaChange}
                aktualnaStrona={strona}
            />
        </div>
    );
};

export default Archiwum;
