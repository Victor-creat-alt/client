import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart'; // Import the BarChart component
import DepartmentForm from './DepartmentForm';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the navigation arrow icon
import './Departments.css';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE_URL = "http://127.0.0.1:5555";
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard'); // Navigate back to Dashboard.jsx
  };


  useEffect(() => {
    axios.get(`${API_BASE_URL}/departments`)
      .then(res => {
        if (res.headers['content-type'].includes('application/json')) {
          setDepartments(res.data);
        } else {
          console.error('Departments data is not JSON:', res);
          setDepartments([]);
        }
      })
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  const handleAddDepartment = (newDepartment) => {
    axios.post(`${API_BASE_URL}/departments`, newDepartment)
      .then(res => {
        setDepartments([...departments, res.data]);
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error adding department:', error));
  };

  const handleDeleteDepartment = (id) => {
    axios.delete(`${API_BASE_URL}/departments/${id}`)
      .then(() => {
        setDepartments(departments.filter(department => department.id !== id));
      })
      .catch(error => console.error('Error deleting department:', error));
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Departments</h1>
      <button className="add-department-button" onClick={() => setIsModalOpen(true)}>
        Add Department
      </button>
      <button onClick={handleBackClick} className="back-button">
        <FaArrowLeft />
      </button>

      {isModalOpen && (
        <DepartmentForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddDepartment} 
        />
      )}

      <input
        type="text"
        placeholder="Search departments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Display Departments */}
      {departments.length > 0 ? (
        <>
          <table className="departments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(department => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.location}</td>
                  <td>{department.head}</td>
                  <td>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <BarChart departments={departments} /> {/* Render the bar chart */}
        </>
      ) : (
        <p>Loading departments...</p>
      )}
    </div>
  );
}

export default Departments;
