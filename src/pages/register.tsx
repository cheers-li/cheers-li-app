import { useState } from 'react';
import { Button, LinkButton } from '../components/button';
import { ExternalProviderLogin } from '../components/external-provider-login';
import { Input } from '../components/input';
import { validateEmail } from '../helper/validator';

const Register = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = () => {
    setError('');
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setError('Not a valid E-Mail address');
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">Create an account</h1>
      <p className="text-sm text-gray-500">
        Use your e-mail to create a new account.
      </p>
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
        <Button primary width="full" onClick={register} disabled={loading}>
          Create an account
        </Button>
        <LinkButton secondary width="full" href="/login" disabled={loading}>
          I already have an account
        </LinkButton>
      </div>
      <hr />
      <p className="text-center text-sm text-gray-500">or continue with</p>
      <ExternalProviderLogin
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default Register;