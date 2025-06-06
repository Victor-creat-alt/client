import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EnrolledStudents.css';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the navigation arrow icon
import { useNavigate } from 'react-router-dom';

function EnrolledStudents() {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleBackClick = () => {
      navigate('/students'); // Navigate back to Students.jsx
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = () => {
        axios.get(`${API_BASE_URL}/enrollments`)
            .then((res) => {
                if (res.headers['content-type'].includes('application/json')) {
                    const enrollments = res.data;
                    const studentCoursePairs = enrollments.map(enrollment => ({
                        id: enrollment.id, // Include the enrollment ID
                        studentName: enrollment.student.name,
                        courseTitle: enrollment.course.title,
                        courseImage: enrollment.course.image_url,
                        courseDescription: enrollment.course.description,
                    }));
                    setEnrolledStudents(studentCoursePairs);
                } else {
                    console.error('Enrollment Data not in JSON:', res);
                    setEnrolledStudents([]);
                }
            })
            .catch((error) => console.error('Error fetching Enrollments:', error));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRemoveEnrollment = (enrollmentId) => {
        axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`)
            .then(() => {
                fetchEnrollments(); // Refresh the list after deletion
            })
            .catch((error) => console.error('Error removing enrollment:', error));
    };

    return (
        <div>
            <h1 className="page-title">Enrolled Students</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            <button onClick={handleBackClick} className="back-button">
        <FaArrowLeft />
      </button>
            {enrolledStudents.length > 0 ? (
                <div className="enrolled-students-container">
                    {enrolledStudents
                        .filter(pair =>
                            pair.studentName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((pair, index) => (
                            <div className="enrolled-student-card" key={index}>
                                <p className="student-name"><strong>Student:</strong> {pair.studentName}</p>
                                <p className="course-title"><strong>Course:</strong> {pair.courseTitle}</p>
                                {pair.courseImage && (
                                    <img
                                        src={pair.courseImage}
                                        alt={pair.courseTitle}
                                        className="course-image"
                                    />
                                )}
                                {pair.courseDescription && (
                                    <p className="course-description"><strong>Description:</strong> {pair.courseDescription}</p>
                                )}
                                <button className="remove-btn" onClick={() => handleRemoveEnrollment(pair.id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                </div>
            ) : (
                <p className="loading-message">Loading enrolled students...</p>
            )}
        </div>
    );
}

export default EnrolledStudents;
