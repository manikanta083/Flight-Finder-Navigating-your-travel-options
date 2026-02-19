
import { useEffect, useState } from 'react';

const AuthProtector =  ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setIsAuthenticated(!!userType);
    
    if (!userType) {
      window.location.href = '/';
    }
  }, []);


  return children;
};

export default AuthProtector;
