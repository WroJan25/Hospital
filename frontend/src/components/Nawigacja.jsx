import React, { useEffect, useState } from 'react';
import '../styles/Nawigacja.css';

const Nawigacja = () => {
    const [userId] = useState(localStorage.getItem('userId'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'gosc');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
        setIsLoggedIn(!!localStorage.getItem('authToken'));
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    return (
        <nav>
            <ul>
                <li>
                    <a href="/lekarze" className="active">Nasi Specjaliści</a>
                </li>
                {isLoggedIn && userRole === 'admin' && (
                    <>
                        <li>
                            <a href="/uzytkownicy">Panel Administratora</a>
                        </li>
                        <li>
                            <a href="/archiwum">Archiwum</a>
                        </li>
                    </>
                )}
                {isLoggedIn && (userRole === 'lekarz' || userRole === 'admin') && (
                    <>
                        <li>
                            <a href="/pacjenci">Pacjenci Kliniki</a>
                        </li>
                        <li>
                            <a href="/choroby">Lista Chorób</a>
                        </li>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <li>
                            <a href="/zaloguj">Zaloguj się</a>
                        </li>
                        <li>
                            <a href="/rejestracja">Zarejestruj się</a>
                        </li>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <li>
                            <a href="/" onClick={handleLogout} className="logout">Wyloguj się</a>
                        </li>
                        <li>
                            <a href={`/uzytkownik/${userId}`}>Profil</a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Nawigacja;
