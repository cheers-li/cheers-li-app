import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, LinkButton } from '../components/button';
import { ExternalProviderLogin } from '../components/external-provider-login';
import { Input } from '../components/input';
import { supabase } from '../services/supabase-client';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error: loginError } = await supabase.auth.signIn({ email });
      if (loginError) throw error;
      navigate('/email-login');
    } catch (err: unknown) {
      setError('Something went wrong while signing you in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      navigate('/');
    });
  }, [navigate]);

  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">Sign in</h1>
      <p className="text-sm text-gray-500">
        Sign in using your E-Mail. We will send you a magic link to log into
        your account.
      </p>
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <Input
          type="email"
          placeholder="email@example.com"
          label="E-Mail"
          value={email}
          error={error}
          onUpdate={setEmail}
          disabled={loading}
        />
        <div className="flex flex-col gap-4">
          <Button primary width="full" disabled={loading}>
            Sign in
          </Button>
          <LinkButton
            secondary
            width="full"
            href="/register"
            disabled={loading}
          >
            Create an account
          </LinkButton>
        </div>
      </form>
      <hr />
      <p className="text-center text-sm text-gray-500">or sign in with</p>
      <ExternalProviderLogin
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default Login;
