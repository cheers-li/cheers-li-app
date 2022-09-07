import { Provider } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../services/supabase-client';
import { Button } from './button';

interface ExternalProviderLoginProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
}

export const ExternalProviderLogin: React.FC<ExternalProviderLoginProps> = ({
  loading,
  setLoading,
  error,
  setError,
}) => {
  const handleExternalProviderLogin = async (provider: Provider) => {
    try {
      setLoading(true);

      const redirectTo = Capacitor.isNativePlatform()
        ? 'io.supabase.cheersli://login-callback'
        : 'http://localhost:5173/login-callback';

      const { error: loginError } = await supabase.auth.signIn(
        { provider },
        { redirectTo },
      );
      if (loginError) throw error;
    } catch (err: unknown) {
      setError('Something went wrong while signing you in.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Button
        link
        width="full"
        onClick={() => handleExternalProviderLogin('google')}
        disabled={loading}
      >
        Continue with Google
      </Button>
      <Button
        link
        width="full"
        onClick={() => handleExternalProviderLogin('apple')}
        disabled={loading}
      >
        Continue with Apple
      </Button>
      <Button
        link
        width="full"
        onClick={() => handleExternalProviderLogin('facebook')}
        disabled={loading}
      >
        Continue with Facebook
      </Button>
    </div>
  );
};
