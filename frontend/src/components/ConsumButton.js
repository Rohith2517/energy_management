import React, { useState } from 'react';
import ConsumChart from './ConsumChart';

const ConsumButton = () => {
    const [predictions, setPredictions] = useState([]);
    const [dates, setDates] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // Track pop-up visibility

    const handleClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predict-consum/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Response from backend:', data);

            setPredictions(data.predictions);
            setDates(data.dates);
            setShowPopup(true); // Open the pop-up after getting the response
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button
                style={{
                    padding: '15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                onClick={handleClick}
            >
                Predict
            </button>

            {showPopup && (
                <div style={popupStyles}>
                    <button
                        style={{
                            alignSelf: 'flex-end',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: '#FF5722',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setShowPopup(false)}
                    >
                        Back
                    </button>

                    <ConsumChart predictions={predictions} dates={dates} />
                </div>
            )}
        </div>
    );
};

// Styles for the pop-up window
const popupStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

export default ConsumButton;
