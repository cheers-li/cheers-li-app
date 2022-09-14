import { useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '~/services/supabase-client';
import { Button } from '~/components/button';
import { ExternalProviderLogin } from '~/components/external-provider-login';
import { Input } from '~/components/input';
import { validateEmail, validatePassword } from '~/helper/validator';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmationPasswordError, setConfirmationPasswordError] =
    useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConfirmationPassword, setValidConfirmationPassword] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (validEmail && validPassword && validConfirmationPassword)
      setValid(true);
    else setValid(false);
  }, [validEmail, validPassword, validConfirmationPassword]);

  const register = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmationPasswordError('');

    try {
      setLoading(true);
      console.log('email', email, 'password', password);
      const {
        // user,
        // session,
        error: loginError,
      } = await supabase.auth.signUp({
        email,
        password,
      });
      if (loginError) throw emailError;

      navigate('/login-callback');
    } catch (err: unknown) {
      setEmailError('Something went wrong while signing you in.');
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = (mail: string): void => {
    setEmail(mail);

    if (!validateEmail(mail)) {
      setEmailError('Not a valid E-Mail address');
      setValidEmail(false);
    } else {
      setEmailError('');
      setValidEmail(true);
    }
  };

  const checkPasswordValidity = (pwd: string) => {
    setPassword(pwd);
    if (!validatePassword(pwd)) {
      setPasswordError(
        'Password must be at least 8 characters long, contain a number, an uppercase letter, a lowercase letter and a special character.',
      );
      setValidPassword(false);
    } else {
      setPasswordError('');
      setValidPassword(true);
    }
  };

  const checkConfirmationPassword = (pwd: string) => {
    setConfirmPassword(pwd);
    if (pwd !== password) {
      setConfirmationPasswordError('Passwords do not match.');
      setValidConfirmationPassword(false);
    } else {
      setConfirmationPasswordError('');
      setValidConfirmationPassword(true);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">Create an account</h1>
      <p className="text-center text-sm text-gray-500">
        Use your e-mail to create a new account.
      </p>
      <Input
        type="email"
        placeholder="email@example.com"
        label="E-Mail"
        value={email}
        error={emailError}
        onUpdate={checkEmail}
        disabled={loading}
      />
      <Input
        type="password"
        label="Password"
        value={password}
        error={passwordError}
        onUpdate={checkPasswordValidity}
        disabled={loading}
      />
      <Input
        type="password"
        label="Repeat password"
        value={confirmPassword}
        error={confirmationPasswordError}
        onUpdate={checkConfirmationPassword}
        disabled={loading}
      />
      <div className="flex flex-col gap-4">
        <Button primary width="full" onClick={register} disabled={!valid}>
          Create an account
        </Button>
      </div>
      <hr />
      <p className="text-center text-sm text-gray-500">or continue with</p>
      <ExternalProviderLogin
        loading={loading}
        setLoading={setLoading}
        error={emailError}
        setError={setEmailError}
      />
    </div>
  );
};

export default Register;
