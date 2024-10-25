/*import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import 'chart.js/auto';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA95MoNmBmz3ifEHcB3rSyxSwO0wKr6sjs",
    authDomain: "my-energy-project-108.firebaseapp.com",
    projectId: "my-energy-project-108",
    storageBucket: "my-energy-project-108.appspot.com",
    messagingSenderId: "86011858947",
    appId: "1:86011858947:web:8ac04450e4ec672efb3e36",
    measurementId: "G-0BHN8863Q5"
  };

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
        
        // Create a query that orders by the index field
        const energyQuery = query(energyRef, orderBy('index'));
    
        // Listen to real-time changes in energy data
        const unsubscribe = onSnapshot(energyQuery, (snapshot) => {
          const data = snapshot.docs.map(doc => doc.data());
          if (data.length > 0) {
            // Get the latest data based on the index ordering
            const latestData = data[data.length - 1];
            console.log('Latest Data:', latestData);
            setSolarProduction(latestData.solar); // Update solar production
            setCurrentRate(latestData.rate); // Update rate
            setSendDate(latestData.SendDate); // Update SendDate
            setConsumption(latestData.consumption); // Update consumption
          }
        });
    
        // Cleanup on unmount
        return () => unsubscribe();
      }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '50%',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '8px',
            display: 'flex', // Use flexbox
            flexDirection: 'column', // Stack elements vertically
            justifyContent: 'center', // Center vertically
            alignItems: 'flex-start', // Align items to the start
            gap: '10px' // Space between elements
        }}>
            {sendDate && (
                <h2 style={{ fontSize: '1.5em', margin: 0 }}>{sendDate}</h2>
            )}
            {solarProduction !== null && currentRate !== null && consumption !== null ? (
                <p style={{ fontSize: '1.2em', margin: 0 }}>
                    <strong>Solar Energy Production:</strong> {solarProduction} kW <br />
                    <strong>Tariff Rate:</strong> ₹{currentRate}/kWh <br />
                    <strong>Consumption:</strong> {consumption} kW
                </p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
    
    
};

export default TariffRateDisplay;*/
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import './TariffRateDisplay.css'; // Use external CSS for the design

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA95MoNmBmz3ifEHcB3rSyxSwO0wKr6sjs",
    authDomain: "my-energy-project-108.firebaseapp.com",
    projectId: "my-energy-project-108",
    storageBucket: "my-energy-project-108.appspot.com",
    messagingSenderId: "86011858947",
    appId: "1:86011858947:web:8ac04450e4ec672efb3e36",
    measurementId: "G-0BHN8863Q5"
};

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
