import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import api from '../pages/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
          }),
        })
          .then((res) => {
            res.json().then(async (data) => {
              if (res.status == 200) {
                api.defaults.headers.Authorization = `Bearer ${token}`;
                const userResponse = await api.get(
                  `/auth/getUser/${data.identnumber}`
                );
                if (userResponse.status == 200) {
                  setUser(userResponse.data);
                }
              } else {
                console.log(data.error);
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const login = async (token, identnumber) => {
    Cookies.set('token', token, { expires: 60 });
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const user = api.get(`/auth/getUser/${identnumber}`);
    setUser(user);
    router.push('/dashboard');
  };

  const logout = (email, password) => {
    Cookies.remove('token');
    setUser({});
    delete api.defaults.headers.Authorization;
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
