import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '~/services/supabase-client';
import { Button } from '~/components/button';
import { User } from '@supabase/supabase-js';
import { createNewProfile, getProfile } from '~/services/profile';
import { Input } from '~/components/input';

const LoginCallback = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [profile, setProfile] = useState();
  const [requireNewProfile, setRequireNewProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const loadProfile = async () => {
    const { data, error } = await getProfile(user?.id);

    if (!error) {
      setProfile(data);
    } else {
      setRequireNewProfile(true);
    }
  };

  useEffect(() => {
    const wait = setTimeout(
      () => setUser(supabase.auth.user() || undefined),
      500,
    );

    return () => clearTimeout(wait);
  }, []);

  useEffect(() => {
    if (user && !profile) {
      loadProfile();
    }
    if (user && profile) {
      console.log(profile);
      navigate('/');
    }
  }, [user, profile, navigate]);

  const submitProfileName = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;

    setUserNameError('');
    setIsProfileLoading(true);

    try {
      const { error } = await createNewProfile(user?.id, userName);
      if (error) {
        if (error.message.includes('duplicate key value')) {
          setUserNameError(
            'The username you choose is already used by someone else. Choose a unique username.',
          );
        }
      }
    } catch {
      setUserNameError('Something went wrong. Try again later.');
    } finally {
      setIsProfileLoading(false);
    }
    await loadProfile();
  };

  return (
    <div className="flex w-full flex-col gap-6 py-8 px-8">
      {!user && <h1 className="text-xl font-bold">One moment please...</h1>}
      {user && requireNewProfile && (
        <>
          <h1 className="text-xl font-bold">Create a Profile</h1>
          <p className="text-sm text-gray-500">
            We need some more information to complete your profile.
          </p>
        </>
      )}
      {!user && !requireNewProfile && (
        <p className="text-sm text-gray-500">
          We are currently fetching your profile.
        </p>
      )}
      {requireNewProfile && (
        <form onSubmit={submitProfileName} className="flex flex-col gap-6">
          <Input
            placeholder="How should we call you?"
            label="Username"
            value={userName}
            error={userNameError}
            onUpdate={setUserName}
            disabled={isProfileLoading}
          />
          <div className="flex flex-col gap-4">
            <Button primary width="full" disabled={isProfileLoading}>
              Save Profile
            </Button>
          </div>
        </form>
      )}
      {/* <LinkButton secondary width="full" href="/">
        Go Home
      </LinkButton> */}
    </div>
  );
};

export default LoginCallback;
