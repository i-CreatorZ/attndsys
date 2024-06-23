"use client"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AttendanceSelection from './Attendance/AttendanceSelection';
import AttendanceManagement from './Attendance/AttendanceManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceSelection />} />
        <Route path="/manage/:date" element={<AttendanceManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
