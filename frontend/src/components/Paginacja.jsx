import React, { useState } from 'react';
import '../styles/Paginacja.css';

const Paginacja = ({ wszystkieRekordy, rekordyNaStrone, onStronaChange }) => {
    const wszystkieStrony = Math.ceil(wszystkieRekordy / rekordyNaStrone);
    const [aktualnaStrona, setAktualnaStrona] = useState(1);

    const handleStronaChange = (strona) => {
        setAktualnaStrona(strona);
        onStronaChange(strona);
    };

    return (
        <div className="pagination-container">
            <button
                onClick={() => handleStronaChange(aktualnaStrona - 1)}
                disabled={aktualnaStrona === 1}
                className="pagination-button"
            >
                {'<'}
            </button>
            <span className="pagination-info">
                Strona {aktualnaStrona} z {wszystkieStrony}
            </span>
            <button
                onClick={() => handleStronaChange(aktualnaStrona + 1)}
                disabled={aktualnaStrona === wszystkieStrony}
                className="pagination-button"
            >
                {'>'}
            </button>
        </div>
    );
};

export default Paginacja;
