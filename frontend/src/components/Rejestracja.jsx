import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Rejestracja.css';

const Rejestracja = () => {
    const [imie, setImie] = useState('');
    const [nazwisko, setNazwisko] = useState('');
    const [email, setEmail] = useState('');
    const [pesel, setPesel] = useState('');
    const [haslo, setHaslo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [zakonczona, setZakonczona] = useState(false);

    const validateForm = () => {
        if (!imie || !nazwisko || !email || !pesel || !haslo) {
            return 'Wszystkie pola muszą być wypełnione';
        }
        if (imie.length < 3) {
            return 'Imię powinno zawierać co najmniej 3 znaki';
        }
        if (nazwisko.length < 3) {
            return 'Nazwisko powinno zawierać co najmniej 3 znaki';
        }
        if (!email.includes('@')) {
            return 'Proszę podać poprawny e-mail';
        }
        if (!pesel.match(/^\d{11}$/)) {
            return 'Proszę podać poprawny PESEL';
        }
        if (haslo.length < 6) {
            return 'Hasło powinno zawierać co najmniej 6 znaków';
        }
        return null;
    };

    const handleRejestracja = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUserId(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/uzytkownik', {
                Imie: imie,
                Nazwisko: nazwisko,
                Email: email,
                Pesel: pesel,
                Haslo: haslo,
            });

            setUserId(response.data.id);
            setZakonczona(true);
        } catch (err) {
            console.error('Błąd rejestracji:', err);
            setError(err.response?.data?.message || 'Błąd serwera');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rejestracja-container">
            <h2>Rejestracja</h2>
            {zakonczona === false && (
                <form onSubmit={handleRejestracja}>
                    <div>
                        <label>Imię:</label>
                        <input
                            type="text"
                            value={imie}
                            onChange={(e) => setImie(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Nazwisko:</label>
                        <input
                            type="text"
                            value={nazwisko}
                            onChange={(e) => setNazwisko(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>PESEL:</label>
                        <input
                            type="text"
                            value={pesel}
                            onChange={(e) => setPesel(e.target.value)}
                            maxLength={11}
                            required
                        />
                    </div>
                    <div>
                        <label>Hasło:</label>
                        <input
                            type="password"
                            value={haslo}
                            onChange={(e) => setHaslo(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                        </button>
                    </div>
                </form>
            )}

            {userId && zakonczona === true && (
                <div className="success-message">
                    Zarejestrowano pomyślnie! Twój ID użytkownika to: {userId}
                </div>
            )}
        </div>
    );
};

export default Rejestracja;
