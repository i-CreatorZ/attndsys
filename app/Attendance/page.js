"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import './Attendance.css'; // Import the CSS file

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('member_info')
        .select('id, name, class, present');

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        setStudents(data);
      }
    };

    fetchStudents();
  }, []);

  const handleAttendance = async (id) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, present: !student.present } : student
    );
    setStudents(updatedStudents);

    const studentToUpdate = updatedStudents.find(student => student.id === id);

    const { data, error } = await supabase
      .from('member_info')
      .update({ present: studentToUpdate.present })
      .eq('id', id);

    if (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const sortStudents = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedStudents = [...students].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setStudents(sortedStudents);
    setSortConfig({ key, direction });
  };

  const getSortClass = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc';
    }
    return 'sorted-none';
  };

  return (
    <table>
      <thead>
        <tr>
          <th
            onClick={() => sortStudents('id')}
            className={getSortClass('id')}
          >
            ID
          </th>
          <th
            onClick={() => sortStudents('name')}
            className={getSortClass('name')}
          >
            Name
          </th>
          <th
            onClick={() => sortStudents('class')}
            className={getSortClass('class')}
          >
            Class
          </th>
          <th
            onClick={() => sortStudents('present')}
            className={getSortClass('present')}
          >
            Present
          </th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.class}</td>
            <td>
              <input
                type="checkbox"
                checked={student.present}
                onChange={() => handleAttendance(student.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Attendance;
