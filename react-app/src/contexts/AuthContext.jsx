import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext with default value null
const AuthContext = createContext(null);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  // Store dynamic logged-in user info
  const [authState, setAuthState] = useState({
    studentId: null,
    userType: null, // 'student' or 'instructor'
    // Add other auth details as needed, e.g., username, token, etc.
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
