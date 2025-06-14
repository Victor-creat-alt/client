import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMessage('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.email) {
      setError('Please enter your email.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/\d/.test(formData.newPassword)) {
      setError('Password must contain at least one digit.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${baseUrl}/reset-password`, {
        email: formData.email,
        new_password: formData.newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FaEnvelope className="icon" />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <FaLock className="icon" />
          <span
            className="password-toggle"
            onClick={toggleShowPassword}
            role="button"
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
