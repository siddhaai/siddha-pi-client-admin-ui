import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [guideName, setGuideName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [companyProvidedPassword, setCompanyProvidedPassword] = useState('');
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        name,
        setName,
        guideName,
        setGuideName,
        accountId,
        setAccountId,
        openDialog2, 
        setOpenDialog2,
        openDialog3,
        setOpenDialog3,
        companyProvidedPassword,
        setCompanyProvidedPassword,
      }
    }
    > 
      {children}
    </AuthContext.Provider>
    
  );
};

export default AuthContext;
