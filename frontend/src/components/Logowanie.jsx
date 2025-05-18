import React, { useState } from 'react';
import axios from 'axios';

const Logowanie = () => {
    const [id, setId] = useState('');
    const [haslo, setHaslo] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/logowanie', {
                id,
                haslo,
            });
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userRole', response.data.rola);
            setToken(response.data.token);
            window.location.href = "/";
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.error || err.response.data.message || 'Błąd logowania');
            } else {
                setError('Wystąpił błąd po stronie serwera');
            }
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>ID:</label>
                    <input
                        type="number"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
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
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {token && (
                    <div>
                        <p>Zalogowano pomyślnie!</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Logowanie;
