"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Attendance.css'; // Import the CSS file

const AttendanceManagement = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    const ensureAttendanceTableExists = async () => {
      const tableName = `attendance_${date.replace(/-/g, '_')}`;

      // Check if the table exists
      const { data: tableExists, error: tableExistsError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', tableName)
        .single();

      if (tableExistsError || !tableExists) {
        // Table does not exist, so create it
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
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
      fetchStudents(tableName);
    };

    const fetchStudents = async (tableName) => {
      const { data, error } = await supabase
        .from('member_info')
        .select('id, name, class');

      if (error) {
        console.error('Error fetching students:', error);
      } else {
        const attendanceData = await supabase
          .from(tableName)
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
    const tableName = `attendance_${date.replace(/-/g, '_')}`;
    const attendanceRecords = students.map(student => ({
      id: student.id,
      date,
      present: student.present,
    }));

    const { data, error } = await supabase
      .from(tableName)
      .upsert(attendanceRecords, { onConflict: ['id', 'date'] });

    if (error) {
      console.error('Error saving attendance:', error);
    } else {
      alert('Attendance saved successfully!');
      navigate(-1); // Go back to the previous page
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container">
      <h1>Manage Attendance for {date}</h1>
      <button onClick={() => navigate(-1)}>Back</button> {/* Back button */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className={`sortable ${sortConfig.key === 'id' ? `sort-${sortConfig.direction}` : ''}`}>ID</th>
            <th onClick={() => handleSort('name')} className={`sortable ${sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}`}>Name</th>
            <th onClick={() => handleSort('class')} className={`sortable ${sortConfig.key === 'class' ? `sort-${sortConfig.direction}` : ''}`}>Class</th>
            <th onClick={() => handleSort('present')} className={`sortable ${sortConfig.key === 'present' ? `sort-${sortConfig.direction}` : ''}`}>Present</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map(student => (
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
