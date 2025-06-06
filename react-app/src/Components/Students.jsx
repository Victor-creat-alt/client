import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RemoveStudentForm from './RemoveStudentForm';
import { FaArrowLeft } from 'react-icons/fa';
import StudentEnrollmentLineGraph from './StudentEnrollmentLineGraph';
import { useNavigate } from 'react-router-dom';

import './Students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lineGraphData, setLineGraphData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE_URL = "/api";
   const navigate = useNavigate();
  
      const handleBackClick = () => {
        navigate('/departments'); // Navigate back to Students.jsx
      };

  useEffect(() => {
    // Fetch all students
    axios.get(`${API_BASE_URL}/students`)
      .then((res) => setStudents(res.data))
      .catch((error) => console.error('Error fetching students:', error));

    // Fetch enrollment counts for all students
    axios.get(`${API_BASE_URL}/student_enrollment_counts`)
      .then((res) => {
        // Filter data to only include students who have registered/logged in and enrolled
        const filteredData = res.data.filter(item => item.enrollmentCount > 0 && item.name);
        setLineGraphData(filteredData);
      })
      .catch((error) => console.error('Error fetching enrollment counts:', error));
  }, []);

  const handleRemoveStudent = (studentId) => {
    axios.delete(`${API_BASE_URL}/students/${studentId}`)
      .then(() => {
        setStudents(students.filter((student) => student.id !== studentId));
        setIsModalOpen(false);
        // Refresh enrollment counts after removing a student
        axios.get(`${API_BASE_URL}/student_enrollment_counts`)
          .then((res) => {
            const filteredData = res.data.filter(item => item.enrollmentCount > 0 && item.name);
            setLineGraphData(filteredData);
          })
          .catch((error) => console.error('Error fetching enrollment counts:', error));
      })
      .catch((error) => console.error('Error removing student:', error));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Students</h1>
      <button
        className="remove-student-button"
        onClick={() => setIsModalOpen(true)}
      >
        Remove Student
      </button>
      <button onClick={handleBackClick} className="back-button">
              <FaArrowLeft />
            </button>

      {isModalOpen && (
        <RemoveStudentForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleRemoveStudent}
        />
      )}

      <input
        type="text"
        placeholder="Search students..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {students.length > 0 ? (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading students...</p>
      )}

      {lineGraphData.length > 0 && (
        <div className="line-graph-section">
          <h2>Student Enrollment Counts</h2>
          <StudentEnrollmentLineGraph data={lineGraphData} />
        </div>
      )}
    </div>
  );
}

export default Students;
