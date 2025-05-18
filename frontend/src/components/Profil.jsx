import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/Profil.css';

const Profil = () => {
    const [specjalizacjaError, setSpejalizacjaError] = useState(null);
    const { userId } = useParams();
    const [infoProfilu, setInfoProfilu] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [zamknij, setZamknij] = useState(false);
    const [usun, setUsun] = useState(false);
    const [pacjentOn, setPacjentOn] = useState(false);
    const[edycjaLekarza,setEdycjaLekarza] = useState(false);
    const [edytowanaData, setEdytowanaData] = useState(null);
    const [formData, setFormData] = useState({
        Imie: '',
        Nazwisko: '',
        Email: '',
        Pesel: '',
        Haslo: ''
    });
    const [specjalizacje, setSpecjalizacje] = useState([]);
    const [selectedSpecjalizacja, setSelectedSpecjalizacja] = useState('');
    const [roleAssigned, setRoleAssigned] = useState(null);

    useEffect(() => {
        if (parseInt(localStorage.getItem('userId'), 10) !== parseInt(userId, 10) && localStorage.getItem('userRole') !== "admin") {
            setError("Brak dostępu do zasobu");
            window.location.href = "/brak-dostepu";
        }

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:3000/uzytkownik/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInfoProfilu(response.data);
                setFormData({
                    Id: response.data.Id,
                    Imie: response.data.userData.Imie,
                    Nazwisko: response.data.userData.Nazwisko,
                    Email: response.data.userData.Email,
                    Pesel: response.data.userData.Pesel,
                    Haslo: response.data.userData.Haslo
                });
                setRoleAssigned(response.data.additionalData !== null);
            } catch (err) {
                setError('Nie udało się pobrać danych.');
            }
        };

        fetchUserData();
    }, [userId,zamknij, editMode, usun,pacjentOn,edycjaLekarza]);

    const validateForm = () => {
        if (!formData.Imie || !formData.Nazwisko || !formData.Email || !formData.Pesel || !formData.Haslo) {
            return 'Wszystkie pola muszą być wypełnione';
        }
        if (formData.Imie.length < 3) {
            return 'Imię powinno zawierać co najmniej 3 znaki';
        }
        if (formData.Nazwisko.length < 3) {
            return 'Nazwisko powinno zawierać co najmniej 3 znaki';
        }
        if (!formData.Email.includes('@')) {
            return 'Proszę podać poprawny e-mail';
        }
        if (!formData.Pesel.match(/^\d{11}$/)) {
            return 'Proszę podać poprawny PESEL';
        }
        if (formData.Haslo.length < 6) {
            return 'Hasło powinno zawierać co najmniej 6 znaków';
        }
        return null;
    };

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/specjalizacja', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSpecjalizacje(response.data);
            } catch (err) {
                console.error('Błąd przy pobieraniu specjalizacji: ', err);
            }
        };

        fetchSpecializations();
    }, [roleAssigned]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:3000/uzytkownik/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEditMode(false);
            alert('Dane zostały zaktualizowane!');
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd serwera');
        }
    };

    const addLekarz = async (e) => {
        e.preventDefault();
        if (!selectedSpecjalizacja) {
            setSpejalizacjaError('Proszę wybrać specjalizację!');
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://localhost:3000/lekarz/${userId}`,{
                Data_Zatrudnienia: currentDate,
                Specjalizacja_Lekarza: parseInt(selectedSpecjalizacja, 10)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Użytkownik został dodany jako lekarz!');
            setRoleAssigned('lekarz');
            setZamknij(prev => !prev);
        } catch (err) {
            setError('Nie udało się dodać użytkownika jako lekarza.');
        }
    };

    const addPacjent = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://localhost:3000/pacjent/${userId}`,{},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Użytkownik został dodany jako pacjent!');
            setRoleAssigned('pacjent');
            setPacjentOn(prevState => !prevState)
        } catch (err) {
            setError('Nie udało się dodać użytkownika jako pacjenta.');
        }
    };

    const deletePacjent = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:3000/pacjent/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsun(prevState => !prevState);
            setRoleAssigned(null);
        } catch (err) {
            setError('Nie udało się usunąć statusu pacjenta');
        }
    }

    const deleteLekarz = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:3000/lekarz/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsun(prevState => !prevState);
            setRoleAssigned(null);
        } catch (err) {
            setError('Nie udało się usunąć statusu lekarza');
        }

    }
    const updateLekarz= async () =>
    {
        const currentDate = new Date();
        const dataZEdycji = new Date(edytowanaData);
        if (dataZEdycji > currentDate) {
            setError("Lekarz nie może być zatrudniony w przyszłości");
            return;
        }
        try {

            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:3000/lekarz/${userId}`,
                    {specjalizacja_Lekarza:parseInt(selectedSpecjalizacja, 10),
                        data_zatrudnienia:dataZEdycji.toISOString().split('T')[0] },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Lekarz zaktualizowany poprawnie")
            setEdycjaLekarza(false)
        }catch (e) {
            setError("Nie udało się zaktualizować lekarza")
        }

    }


    if (!infoProfilu) {
        return <div>Ładowanie...</div>;
    }
    return (
        <div className="profil-container">
            <h2>Profil użytkownika</h2>
            <p><strong>Id:</strong>{infoProfilu.userData?.Id}</p>
            {!editMode ? (
                <div>
                    <p><strong>Imię:</strong> {infoProfilu?.userData?.Imie}</p>
                    <p><strong>Nazwisko:</strong> {infoProfilu?.userData?.Nazwisko}</p>
                    <p><strong>Email:</strong> {infoProfilu?.userData?.Email}</p>
                    <p><strong>Pesel:</strong> {infoProfilu?.userData?.Pesel}</p>
                    <button onClick={() => setEditMode(true)}>Edytuj</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Imię:</label>
                        <input
                            type="text"
                            name="Imie"
                            value={formData.Imie}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Nazwisko:</label>
                        <input
                            type="text"
                            name="Nazwisko"
                            value={formData.Nazwisko}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Pesel:</label>
                        <input
                            type="text"
                            name="Pesel"
                            value={formData.Pesel}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Hasło:</label>
                        <input
                            type="password"
                            placeholder=""
                            name="Haslo"
                            value={formData.Haslo}
                            onChange={handleChange}
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <button type="submit">Zapisz zmiany</button>
                    <button type="button" onClick={() => setEditMode(false)}>Anuluj</button>
                </form>
            )}
            {infoProfilu?.additionalData?.rola === 'pacjent' && (
                <div>
                    <h3>Twoja książeczka zdrowia</h3>
                    <ul>
                        {infoProfilu?.additionalData?.ksiazkaZdrowia && infoProfilu.additionalData.ksiazkaZdrowia.map((item, index) => (
                            <li key={index}>
                                <p><strong>Choroba:</strong> {item.Nazwa}</p>
                                <p><strong>Data wykrycia:</strong> {new Date(item.Wykrycie).toLocaleDateString()}</p>
                                <p><strong>Lekarz:</strong>{item.Imie} {item.Nazwisko}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {infoProfilu?.additionalData?.rola === 'lekarz' && edycjaLekarza===false &&  (
                <div>
                    <h3>Dane lekarza</h3>
                    <p><strong>Specjalizacja:</strong> {infoProfilu?.additionalData?.daneLekarza?.Nazwa_Specjalizacji}</p>
                    <p><strong>Data Zatrudnienia:</strong> {new Date(infoProfilu?.additionalData?.daneLekarza?.Data_Zatrudnienia).toLocaleDateString()}</p>
                    {localStorage.getItem('userRole')==='admin' && edycjaLekarza===false &&(
                        <button onClick={()=> setEdycjaLekarza(true)}>Edytuj Dane Lekarza</button>
                    )}
                </div>

            )}
            {edycjaLekarza===true && (


                <div>
                    <h3>Edytuj dane lekarza</h3>
                    <form>
                        <div>
                            <label>Wybierz specjalizację</label>
                            <select
                                value={selectedSpecjalizacja}
                                onChange={(e) => setSelectedSpecjalizacja(e.target.value)}
                            >
                                <option value="">Wybierz specjalizację</option>
                                {specjalizacje.map((specjalizacja) => (
                                    <option key={specjalizacja.Id} value={specjalizacja.Id}>
                                        {specjalizacja.Nazwa_Specjalizacji}
                                    </option>
                                ))}
                            </select>
                            {specjalizacjaError && <div className="error-message">{specjalizacjaError}</div>}
                        </div>
                    </form>
                    <div>
                        {error && <div className="error-message">{error}</div>}
                    <label></label>
                    <input type="date"
                            className="date-input"
                            defaultValue={new Date().toLocaleDateString()}
                            onChange={(e)=> setEdytowanaData(e.target.value)}>

                    </input>
                    </div>
                    <button onClick={updateLekarz}> Zapisz zmiany

                    </button>
                </div>

            )}

            {
                infoProfilu?.additionalData?.rola === 'lekarz' && localStorage.getItem('userRole') === 'admin' && (
                    <div>
                    <button onClick={() => deleteLekarz()}>Usuń Lekarza</button>
                </div>
            )}
            {infoProfilu?.additionalData?.rola === 'pacjent' && localStorage.getItem('userRole') === 'admin' && (
                <div>
                    <button onClick={() => deletePacjent()}>Usuń Pacjenta</button>
                </div>
            )}

            {localStorage.getItem('userRole') === 'admin' && roleAssigned === false && (
                <div className="action-buttons">
                    <button onClick={addPacjent}>Dodaj Pacjenta</button>
                    <button onClick={() => setRoleAssigned('lekarzDod')}>Dodaj Lekarza</button>
                </div>
            )}

            {roleAssigned === 'lekarzDod' && (
                <div className="specjalizacja-section">
                    <h3>Dodaj lekarza</h3>
                    <form>
                        <div>
                            <label>Wybierz specjalizację</label>
                            <select
                                value={selectedSpecjalizacja}
                                onChange={(e) => setSelectedSpecjalizacja(e.target.value)}
                            >
                                <option value="">Wybierz specjalizację</option>
                                {specjalizacje.map((specjalizacja) => (
                                    <option key={specjalizacja.Id} value={specjalizacja.Id}>
                                        {specjalizacja.Nazwa_Specjalizacji}
                                    </option>
                                ))}
                            </select>
                            {specjalizacjaError && <div className="error-message">{specjalizacjaError}</div>}
                        </div>
                        <button onClick={addLekarz}>Dodaj lekarza</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profil;
