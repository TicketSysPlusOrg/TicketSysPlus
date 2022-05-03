import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import TSPApp from './Components/TSPApp.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TSPApp login={true}/>
  </React.StrictMode>
);
