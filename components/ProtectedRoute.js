import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import LoadingSpinner from './LoadingSpinner';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!Cookies.get('token')) {
      router.push('/login');
    }
  }, [user]);

  if (isLoading || (!isAuthenticated && router.pathname !== '/login')) {
    return (
      <div style={{ marginTop: 100 + 'px' }}>
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  } else {
    return children;
  }
};

export default ProtectedRoute;
