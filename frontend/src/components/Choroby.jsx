import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Choroby.css';

const Choroby = () => {
    const [choroby, setChoroby] = useState([]);
    const [error, setError] = useState(null);
    const [trybDodawania, setTrybDodawania] = useState(false);
    const [nowaChoroba, setNowaChoroba] = useState({
        Nazwa: '',
        Symptomy: '',
        Skala_Zakaznosci: null,
    });
    const navigate = useNavigate();
    const [usunieto, setUsunieto] = useState(false);
    const loggedUserRole = localStorage.getItem('userRole');

    useEffect(() => {
        if (loggedUserRole !== 'lekarz' && loggedUserRole !== 'admin') {
            setError('Brak dostępu do zasobu');
            window.location.href = '/brak-dostepu';
        }
        const fetchChoroby = async () => {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:3000/choroby', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChoroby(response.data);
        };
        fetchChoroby();
    }, [trybDodawania, usunieto, loggedUserRole]);

    const deleteChoroba = async (id) => {
        try {
            setUsunieto(true);
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:3000/choroby/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsunieto(false);
        } catch (err) {
            setError('Nie udało się usunąć choroby');
        }
    };

    const addChoroba = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://localhost:3000/choroby`, nowaChoroba, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNowaChoroba({
                Nazwa: '',
                Symptomy: '',
                Skala_Zakaznosci: null,
            });
            setTrybDodawania((prev) => !prev);
        } catch (err) {
            setError('Nie udało się dodać choroby');
        }
    };

    const szczegolyChoroby = (Id) => {
        navigate(`/choroby/${Id}`);
    };

    return (
        <div className="chorobyKontener">
            <h2 className="chorobyTytul">Lista Chorób</h2>
            <ul className="chorobyLista">
                {choroby.map((choroba) => (
                    <li key={choroba.Id} className="chorobyElement">
                        <p><strong>Nazwa:</strong> {choroba.Nazwa}</p>
                        <button
                            className="chorobyPrzycisk"
                            onClick={() => szczegolyChoroby(choroba.Id)}
                        >
                            Szczegóły
                        </button>
                        {localStorage.getItem('userRole') === 'admin' && (
                            <button
                                className="chorobyPrzycisk chorobyPrzyciskUsun"
                                onClick={() => deleteChoroba(choroba.Id)}
                            >
                                Usuń Chorobę
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <div className="chorobyDodawanie">
                <button
                    className="chorobyPrzycisk"
                    onClick={() => setTrybDodawania((prev) => !prev)}
                >
                    Dodaj Chorobę
                </button>
            </div>
            {trybDodawania === true && localStorage.getItem('userRole') === 'admin' && (
                <div className="chorobyFormularz">
                    <h3>Nowa Choroba</h3>
                    <div>
                        <label>Nazwa</label>
                        <input
                            type="text"
                            placeholder="Nazwa"
                            value={nowaChoroba.Nazwa}
                            onChange={(e) =>
                                setNowaChoroba({ ...nowaChoroba, Nazwa: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Symptomy</label>
                        <input
                            type="text"
                            placeholder="Symptomy"
                            value={nowaChoroba.Symptomy}
                            onChange={(e) =>
                                setNowaChoroba({ ...nowaChoroba, Symptomy: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Skala Zakaźności</label>
                        <input
                            type="number"
                            placeholder=""
                            value={nowaChoroba.Skala_Zakaznosci}
                            onChange={(e) =>
                                setNowaChoroba({
                                    ...nowaChoroba,
                                    Skala_Zakaznosci: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <button className="chorobyPrzycisk" onClick={() => addChoroba()}>
                            Akceptuj
                        </button>
                    </div>
                </div>
            )}
            {error && <div className="chorobyBlad">{error}</div>}
        </div>
    );
};

export default Choroby;
