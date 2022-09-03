import { useState } from 'react';
import { Button } from '../components/button';
import { supabase } from '../services/supabase-client';

const Index = () => {
  const logout = () => supabase.auth.signOut();
  const [user] = useState(supabase.auth.user());

  console.log(user);

  return (
    <div className="flex w-full flex-col gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">Welcome Back</h1>
      <p className="text-center text-sm text-gray-500">
        You are currently logged in as: {user?.email}
      </p>

      <Button primary onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Index;
