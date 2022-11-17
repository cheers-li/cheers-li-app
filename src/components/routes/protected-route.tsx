import { User } from '@supabase/supabase-js';
import { Navigate, Outlet } from 'react-router-dom';
import { Profile } from '~/services/friends';
import store from '~/store';

export const ProtectedRoute = () => {
  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile | null>('profile');

  if (user && profile) {
    return <Outlet />;
  } else if (user && !profile) {
    return <Navigate to="/login-callback" />;
  } else {
    return <Navigate to="/welcome" />;
  }
};
