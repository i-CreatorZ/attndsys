"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './Attendance.css'; // Import the CSS file

const AttendanceManagement = () => {
  const { date } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const ensureAttendanceTableExists = async () => {
      // Check if the attendance table exists
      const { data, error } = await supabase.rpc('current_role');
    if (error) {
        console.error('Error fetching current role:', error);
    } else {
        console.log('Current Role:', data);
    }
      const { data: tableExists, error: tableExistsError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'attendance')
        .single();

      if (tableExistsError || !tableExists) {
        // Table does not exist, so create it
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS attendance (
            id text PRIMARY KEY,
            date date NOT NULL,
            present boolean NOT NULL,
            UNIQUE (id, date)
          );
        `;
        const { error: createTableError } = await supabase.rpc('execute_sql', { sql: createTableQuery });

        if (createTableError) {
          console.error('Error creating attendance table:', createTableError);
          return;
        }
      }

      // Table exists or has been created, proceed to fetch students and attendance data
      fetchStudents();
    };

    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('member_info')
        .select('id, name, class');

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        const attendanceData = await supabase
          .from('attendance')
          .select('id, present')
          .eq('date', date);

        if (attendanceData.error) {
          console.error('Error fetching attendance:', attendanceData.error);
        } else {
          const attendanceMap = new Map(attendanceData.data.map(item => [item.id, item.present]));
          const studentsWithAttendance = data.map(student => ({
            ...student,
            present: attendanceMap.get(student.id) || false,
          }));
          setStudents(studentsWithAttendance);
        }
      }
    };

    ensureAttendanceTableExists();
  }, [date]);

  const handleAttendance = (id) => {
    setStudents(students.map(student =>
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  const handleSave = async () => {
    const attendanceRecords = students.map(student => ({
      id: student.id,
      date,
      present: student.present,
    }));

    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendanceRecords, { onConflict: ['id', 'date'] });

    if (error) {
      console.error('Error saving attendance:', error);
    } else {
      alert('Attendance saved successfully!');
    }
  };

  return (
    <div>
      <h1>Manage Attendance for {date}</h1>
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
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default AttendanceManagement;
