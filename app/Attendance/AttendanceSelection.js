"use client"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceSelection = () => {
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/manage/${date}`);
  };

  return (
    <div>
      <h1>Select Date for Attendance</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create or Update Attendance</button>
      </form>
    </div>
  );
};

export default AttendanceSelection;
