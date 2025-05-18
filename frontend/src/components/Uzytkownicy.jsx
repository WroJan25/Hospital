import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from "react-router-dom";
import '../styles/Uzytkownicy.css';
import axios from "axios";

const Uzytkownicy = () => {
    const [uzytkownicy, setUzytkownicy] = useState([]);
    const [nowyUzytkownik, setNowyUzytkownik] = useState({
        Imie: '',
        Nazwisko: '',
        Email: '',
        Pesel: '',
        Haslo: '',
    });
    const navigate = useNavigate();
    const [trybDodawania, setTrybDodawania] = useState(false);
    const [usunieto, setUsunieto] = useState(false);
    const [blad, setBlad] = useState(null);
    const zalogowanyUzytkownikRola = localStorage.getItem("userRole");

    const walidujFormularz = () => {
        if (!nowyUzytkownik.Imie || !nowyUzytkownik.Nazwisko || !nowyUzytkownik.Email || !nowyUzytkownik.Pesel || !nowyUzytkownik.Haslo) {
            return 'Wszystkie pola muszą być wypełnione';
        }
        if (nowyUzytkownik.Imie.length < 3) {
            return 'Imię powinno zawierać co najmniej 3 znaki';
        }
        if (nowyUzytkownik.Nazwisko.length < 3) {
            return 'Nazwisko powinno zawierać co najmniej 3 znaki';
        }
        if (!nowyUzytkownik.Email.includes('@')) {
            return 'Proszę podać poprawny e-mail';
        }
        if (!nowyUzytkownik.Pesel.match(/^\d{11}$/)) {
            return 'Proszę podać poprawny PESEL';
        }
        if (nowyUzytkownik.Haslo.length < 6) {
            return 'Hasło powinno zawierać co najmniej 6 znaków';
        }
        return null;
    };

    const dodajUzytkownika = async () => {
        try {
            setBlad('');
            const bladWalidacji = walidujFormularz();
            if (bladWalidacji) {
                setBlad(bladWalidacji);
                return;
            }
            const token = localStorage.getItem('authToken');
            await API.post('/uzytkownik', nowyUzytkownik, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNowyUzytkownik({ Imie: '', Nazwisko: '', Email: '', Pesel: '', Haslo: '' });
            setTrybDodawania(false);
        } catch (error) {
            setBlad(error.response?.data?.message || 'Błąd serwera');
        }
    };

    const usunUzytkownika = async (id) => {
        try {
            setUsunieto(false);
            const token = localStorage.getItem('authToken');
            await API.delete(`/uzytkownik/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsunieto(true);
        } catch (error) {
            console.error('Błąd podczas usuwania użytkownika:', error);
        }
    };

    const przeniesNaProfil = (id) => {
        try {
            navigate(`/uzytkownik/${id}`);
        } catch (error) {
            console.error('Nie udało się znaleźć profilu', error);
        }
    };

    useEffect(() => {
        if (zalogowanyUzytkownikRola !== "admin") {
            setBlad("Brak dostępu do zasobu");
            window.location.href = "/brak-dostepu";
        }
        const pobierzUzytkownikow = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/uzytkownik', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUzytkownicy(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania użytkowników:', error);
            }
        };
        pobierzUzytkownikow();
    }, [usunieto, trybDodawania]);

    return (
        <div className="uzytkownicyKontener">
            <h1>Użytkownicy</h1>
            <div className="lista-uzytkownikow">
                {uzytkownicy.map((uzytkownik) => (
                    <div className="kontenerNaUzytkownika" key={uzytkownik.Id}>
                        <p>{`${uzytkownik.Imie} ${uzytkownik.Nazwisko}`}</p>
                        <button onClick={() => usunUzytkownika(uzytkownik.Id)}>Usuń</button>
                        <button onClick={() => przeniesNaProfil(uzytkownik.Id)}>Wjedź w Profil</button>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => setTrybDodawania(true)}>Dodaj Nowego Użytkownika</button>
            </div>
            {trybDodawania && (
                <div className="formularz-dodawania">
                    <h2>Dodaj Użytkownika</h2>
                    <input
                        type="text"
                        placeholder="Imię"
                        value={nowyUzytkownik.Imie}
                        onChange={(e) => setNowyUzytkownik({ ...nowyUzytkownik, Imie: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Nazwisko"
                        value={nowyUzytkownik.Nazwisko}
                        onChange={(e) => setNowyUzytkownik({ ...nowyUzytkownik, Nazwisko: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={nowyUzytkownik.Email}
                        onChange={(e) => setNowyUzytkownik({ ...nowyUzytkownik, Email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Pesel"
                        value={nowyUzytkownik.Pesel}
                        onChange={(e) => setNowyUzytkownik({ ...nowyUzytkownik, Pesel: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={nowyUzytkownik.Haslo}
                        onChange={(e) => setNowyUzytkownik({ ...nowyUzytkownik, Haslo: e.target.value })}
                    />
                    {blad && <div className="blad">{blad}</div>}
                    <button onClick={dodajUzytkownika}>Dodaj</button>
                </div>
            )}
        </div>
    );
};

export default Uzytkownicy;
