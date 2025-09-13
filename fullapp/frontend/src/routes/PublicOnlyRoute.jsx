import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicOnlyRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-600'>
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}