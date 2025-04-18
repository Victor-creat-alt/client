// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Home from './Pages/Home/Home.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Courses from './Pages/Courses/CourseDetails.jsx';
import About from './Pages/About/About.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Departments from './Components/Departments.jsx';
import Students from './Components/Students.jsx';
import LoginSignup from './Components/LoginSignup.jsx';
import SelectOption from './Components/SelectOption.jsx';
import EnrolledStudents from './Components/EnrolledStudents.jsx';
import LogOut from './Components/LogOut.jsx'; // Import LogOut

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<SelectOption />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/logout" element={<LogOut />} /> {/* Add LogOut route */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/students" element={<Students />} />
            <Route path="/enrolled-students" element={<EnrolledStudents />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
