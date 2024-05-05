import React, { useState } from 'react';

const Attendance = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Ernest ', class: '1a', present: false },
    { id: 2, name: 'Unknown', class: '1b', present: false },
    // Add more students as needed
  ]);

  const handleAttendance = (id) => {
    setStudents(students.map(student =>
      student.id === id ? { ...student, present: !student.present } : student
    ));
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