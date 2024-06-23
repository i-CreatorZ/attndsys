"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import './Attendance.css'; // Import the CSS file

const Attendance = () => {
  const [students, setStudents] = useState([]);

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

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Class</th>
          <th>Present</th>
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
