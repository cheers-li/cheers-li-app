import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../services/supabase-client';
import { LinkButton } from '../components/button';

const LoginCallback = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(supabase.auth.user());

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      navigate('/');
      setUser(supabase.auth.user());
    });
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="flex w-full flex-col gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">
        You should be logged in now
      </h1>
      {user && (
        <p className="text-center text-sm text-gray-500">
          You are currently logged in as: {user?.email}
        </p>
      )}
      {!user && (
        <p className="text-center text-sm text-gray-500">
          You are not logged in!
        </p>
      )}
      <LinkButton secondary width="full" href="/">
        Go Home
      </LinkButton>
    </div>
  );
};

export default LoginCallback;
