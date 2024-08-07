import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './global.css'; // Import global styles if any

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
