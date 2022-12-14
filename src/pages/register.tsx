import { useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '~/services/supabase-client';
import { Button } from '~/components/button';
import { ExternalProviderLogin } from '~/components/external-provider-login';
import { Input } from '~/components/input';
import { validateEmail, validatePassword } from '~/helper/validator';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { Link } from 'react-router-dom';

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
    setValid(validEmail && validPassword && validConfirmationPassword);
  }, [validEmail, validPassword, validConfirmationPassword]);

  const register = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmationPasswordError('');

    try {
      setLoading(true);
      const { error: loginError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        { redirectTo: '/login' },
      );
      if (loginError) throw emailError;
      sendSuccessFeedback();
      navigate('/confirm-email');
    } catch (err: unknown) {
      sendErrorFeedback();
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
    <div className="pt-safe-top">
      <div className="flex w-full flex-col justify-center gap-6 py-8 px-8">
        <h1 className="text-xl font-bold">Create an account</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          Use your e-mail to create a new account.
        </p>
        <form
          onSubmit={register}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
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
            placeholder="Choose a secure password"
            value={password}
            error={passwordError}
            onUpdate={checkPasswordValidity}
            disabled={loading}
          />
          <Input
            type="password"
            label="Repeat password"
            placeholder="Repeat your password"
            value={confirmPassword}
            error={confirmationPasswordError}
            onUpdate={checkConfirmationPassword}
            disabled={loading}
          />
          <p className="space-x-2 text-gray-500 dark:text-neutral-300">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-semibold text-sky-700 active:text-sky-600 dark:text-sky-500"
            >
              Login
            </Link>
          </p>
          <div className="flex flex-col gap-4">
            <Button primary width="full" disabled={!valid || loading}>
              Create an account
            </Button>
          </div>
        </form>
        <hr className="dark:border-neutral-800" />
        <p className="text-center text-sm text-gray-500 dark:text-neutral-300">
          or continue with
        </p>
        <ExternalProviderLogin
          loading={loading}
          setLoading={setLoading}
          error={emailError}
          setError={setEmailError}
        />
      </div>
    </div>
  );
};

export default Register;
