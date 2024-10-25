// src/components/Dashboard.js
/*import React from 'react';
import TariffRateDisplay from './DisplayData';
import SimpleButton from './PredButton'; // Adjust the path if necessary
import './Dashboard.css'; // Optional: For custom styling

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="tariff-rate-box">
                <TariffRateDisplay />
            </div>
            <div className="button-container">
                <SimpleButton />
            </div>
        </div>
    );
};

export default Dashboard;*/

// src/components/Dashboard.js
import React from 'react';
import TariffRateDisplay from './DisplayData';
import SimpleButton from './PredButton'; // Adjust path if needed
import ConsumButton from './ConsumButton';
import './Dashboard.css'; // For custom styling

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="tariff-rate-box">
                <TariffRateDisplay />
            </div>
            <div className="button-container">
                <span className="button-label">Predict Future Solar Production:</span>
                <SimpleButton />
            </div>
            <div className="button-container">
                <span className="button-label">Predict Future Consumption:</span>
                <ConsumButton />
            </div>
        </div>
    );
};

export default Dashboard;
