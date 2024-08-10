"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/page';
import Marks from './Marks/page'
import Login from './auth/page'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/> 
      </Routes>
    </Router>
  );
};

export default App;
