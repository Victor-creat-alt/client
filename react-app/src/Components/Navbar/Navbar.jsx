import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing the logout icon
import './Navbar.css';

const Navbar = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = ['/home', '/courses', '/about', '/logout'].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the auth token
    sessionStorage.clear(); // Clear session storage
    navigate('/login', { state: { userType: 'student' } }); // Redirect to the student login page
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function
  };

  if (!showNav) {
    return null;
  }

  return (
    <div>
      <nav className="nav">
        <div className="navigation">
          <div className="nav_header">
            <h2 className="nav_logo">
              Tech Academy
              <br/>
            </h2>
          </div>
          <div className="links">
            <ul>
              <li>
                <Link to="/home" className={location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}>HOME</Link>
              </li>
              <li>
                <Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''}>COURSES</Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>ABOUT</Link>
              </li>
              <li>
                <button onClick={handleLogoutClick} className="logout-button">
                  <FaSignOutAlt />
                </button>
              </li>
              {isLoggedIn && (
                <li>
                  <button onClick={handleLogoutClick}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
