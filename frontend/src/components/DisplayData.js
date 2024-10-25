import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './TariffRateDisplay.css'; // Use external CSS for the design

// Firebase configuration
/*const firebaseConfig = { your firebase config }*/ 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TariffRateDisplay = () => {
    const [solarProduction, setSolarProduction] = useState(null);
    const [currentRate, setCurrentRate] = useState(null);
    const [sendDate, setSendDate] = useState(null);
    const [consumption, setConsumption] = useState(null);

    useEffect(() => {
        const energyRef = collection(db, 'Values');
        const energyQuery = query(energyRef, orderBy('index'));

        // Listen to real-time changes
        const unsubscribe = onSnapshot(energyQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            if (data.length > 0) {
                const latestData = data[data.length - 1];
                console.log('Latest Data:', latestData);
                setSolarProduction(latestData.solar);
                setCurrentRate(latestData.rate);
                setSendDate(latestData.SendDate);
                setConsumption(latestData.consumption);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="container">
            <div className="title">
                <h2>CURRENT TIME: {sendDate || 'Energy Overview'}</h2>
            </div>

            <div className="box">
                <div className="card">
                    <h3>Solar Production</h3>
                    <p>{solarProduction !== null ? `${solarProduction} kW` : 'Loading...'}</p>
                </div>

                <div className="card">
                    <h3>Tariff Rate</h3>
                    <p>{currentRate !== null ? `₹${currentRate}/kWh` : 'Loading...'}</p>
                </div>

                <div className="card">
                    <h3>Consumption</h3>
                    <p>{consumption !== null ? `${consumption} kW` : 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
};

export default TariffRateDisplay;
