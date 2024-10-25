
import React from 'react';
import './App.css';
//import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import TariffRateDisplay from './components/DisplayData'; // Import your SolarBoard com
import SimpleButton from './components/PredButton'; // Adjust the path as necessary 
import Dashboard from './components/Dashboard';


// Firebase configuration
/*const firebaseConfig = {
  apiKey: "AIzaSyA95MoNmBmz3ifEHcB3rSyxSwO0wKr6sjs",
  authDomain: "my-energy-project-108.firebaseapp.com",
  projectId: "my-energy-project-108",
  storageBucket: "my-energy-project-108.appspot.com",
  messagingSenderId: "86011858947",
  appId: "1:86011858947:web:8ac04450e4ec672efb3e36",
  measurementId: "G-0BHN8863Q5"
};
<div className="App">
            <h1>Welcome to My Energy Project</h1>
            <TariffRateDisplay />
            
            <SimpleButton />
        </div>
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
*/
function App() {
    return (
        <div className="App">
            <h1>Welcome to the Energy Dashboard</h1>
            <Dashboard />
        </div>
    );
}

export default App;

