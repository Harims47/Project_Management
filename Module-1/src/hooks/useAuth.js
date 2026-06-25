import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('currentUserRole') || 'Director';
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('currentUserEmail') || '';
  });

  const login = (userEmail, userRole, remember = false) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserRole', userRole);
    localStorage.setItem('currentUserEmail', userEmail);
    if (remember) {
      localStorage.setItem('rememberedUser', userEmail);
    } else {
      localStorage.removeItem('rememberedUser');
    }
    setIsAuthenticated(true);
    setRole(userRole);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUserEmail');
    setIsAuthenticated(false);
    setRole('Director');
    setEmail('');
  };

  return {
    isAuthenticated,
    role,
    email,
    login,
    logout
  };
};

export default useAuth;
