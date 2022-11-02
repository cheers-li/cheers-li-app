import { User } from '@supabase/supabase-js';
import { Navigate, Outlet } from 'react-router-dom';
import store from '~/store';

export const ProtectedRoute = () => {
  const [user] = store.useState<User>('user');

  return user ? <Outlet /> : <Navigate to="/welcome" />;
};
