import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProfile } from '~/services/profile';
import { Page } from '~/components/page';
import { CreateProfile } from '~/components/signup/create-profile';
import { AskNotificationPermission } from '~/components/signup/ask-notification-permission';
import { AskLocationPermission } from '~/components/signup/ask-location-permission';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from '~/services/supabase-client';
import { User } from '@supabase/supabase-js';
import { signOut, storeUser } from '~/services/auth';
import { Button } from '~/components/button';
import store from '~/store';
import { Profile } from '~/services/friends';

enum SignUpState {
  USER_NOT_LOADED,
  LOAD_USER,
  LOAD_USER_COMPLETE,
  REQUIRE_PROFILE,
  COMPLETED_PROFILE,
  PERMISSION_PUSH_NOTIFICATION,
  COMPLETED_PERMISSION_PUSH_NOTIFICATION,
  PERMISSION_LOCATION,
  COMPLETED_PERMISSION_LOCATION,
  COMPLETED,
  ERROR,
}

const LoginCallback = () => {
  const navigate = useNavigate();

  const [user, setGlobalUser] = store.useState<User | null>('user');
  const [, setGlobalProfile] = store.useState<Profile | null>('profile');

  const [showUserLoading, setShowUserLoading] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showError, setShowError] = useState(false);

  const [currentState, setCurrentState] = useState<SignUpState>(
    SignUpState.USER_NOT_LOADED,
  );

  const hasProfile = async () => {
    const { data, error } = await getProfile(user?.id);
    setGlobalProfile(data);
    return !error;
  };

  const onStateChange = async () => {
    switch (currentState) {
      case SignUpState.USER_NOT_LOADED: {
        setTimeout(() => {
          setCurrentState(SignUpState.LOAD_USER);
        }, 500);
        break;
      }
      case SignUpState.LOAD_USER: {
        setShowUserLoading(true);

        if (user) {
          setCurrentState(SignUpState.LOAD_USER_COMPLETE);
          break;
        }

        const session = supabase.auth.session();
        if (!session || !session.access_token) {
          console.error('No active session found');
          setCurrentState(SignUpState.ERROR);
          break;
        }

        const result = await supabase.auth.api.getUser(session.access_token);

        setGlobalUser(result.user);
        storeUser(result.user);

        if (!user) {
          setCurrentState(SignUpState.USER_NOT_LOADED);
          break;
        }

        setCurrentState(SignUpState.LOAD_USER_COMPLETE);
        break;
      }
      case SignUpState.LOAD_USER_COMPLETE:
        setShowUserLoading(false);
        setCurrentState(SignUpState.REQUIRE_PROFILE);
        break;
      case SignUpState.REQUIRE_PROFILE: {
        const hasExistingProfile = await hasProfile();

        if (hasExistingProfile) {
          setCurrentState(SignUpState.COMPLETED_PROFILE);
        } else {
          setShowProfileDialog(true);
        }
        break;
      }
      case SignUpState.COMPLETED_PROFILE:
        setShowProfileDialog(false);
        setCurrentState(SignUpState.PERMISSION_PUSH_NOTIFICATION);
        break;
      case SignUpState.PERMISSION_PUSH_NOTIFICATION: {
        if (!Capacitor.isNativePlatform()) {
          setCurrentState(SignUpState.COMPLETED_PERMISSION_PUSH_NOTIFICATION);
          break;
        }
        if (Capacitor.getPlatform() === 'android') {
          await PushNotifications.register();
          setCurrentState(SignUpState.COMPLETED_PERMISSION_PUSH_NOTIFICATION);
          break;
        }

        const permission = await PushNotifications.checkPermissions();
        if (
          permission.receive === 'granted' ||
          permission.receive === 'denied'
        ) {
          setCurrentState(SignUpState.COMPLETED_PERMISSION_PUSH_NOTIFICATION);
        }

        setShowNotificationDialog(true);
        break;
      }
      case SignUpState.COMPLETED_PERMISSION_PUSH_NOTIFICATION:
        setShowNotificationDialog(false);
        setCurrentState(SignUpState.PERMISSION_LOCATION);
        break;
      case SignUpState.PERMISSION_LOCATION: {
        if (!Capacitor.isNativePlatform()) {
          setCurrentState(SignUpState.COMPLETED_PERMISSION_LOCATION);
          break;
        }
        try {
          const permission = await Geolocation.checkPermissions();
          if (
            permission.location === 'granted' ||
            permission.location === 'denied'
          ) {
            setCurrentState(SignUpState.COMPLETED_PERMISSION_LOCATION);
          }

          setShowLocationDialog(true);
        } catch (error) {
          setCurrentState(SignUpState.COMPLETED_PERMISSION_LOCATION);
        }
        break;
      }
      case SignUpState.COMPLETED_PERMISSION_LOCATION:
        setShowLocationDialog(false);
        setCurrentState(SignUpState.COMPLETED);
        break;
      case SignUpState.COMPLETED:
        navigate('/');
        break;
      case SignUpState.ERROR:
        setShowError(true);
        break;
    }
  };

  useEffect(() => {
    onStateChange();
  }, [currentState]);

  const cleanSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };

  return (
    <Page hideNavigation={true}>
      <div className="flex w-full flex-col gap-6 px-8">
        {showError && (
          <>
            <p className="text-sm text-red-500">
              We are sorry, something went wrong while logging you in. Try to
              log in again later.
            </p>
            <Button primary onClick={cleanSignOut}>
              Go back Home
            </Button>
          </>
        )}
        {!showError && showUserLoading && (
          <p className="text-sm text-gray-500 dark:text-neutral-300">
            One moment, we are loading your user account.
          </p>
        )}
        {showProfileDialog && (
          <CreateProfile
            complete={() => setCurrentState(SignUpState.COMPLETED_PROFILE)}
          />
        )}
        {showNotificationDialog && (
          <AskNotificationPermission
            complete={() =>
              setCurrentState(
                SignUpState.COMPLETED_PERMISSION_PUSH_NOTIFICATION,
              )
            }
          />
        )}
        {showLocationDialog && (
          <AskLocationPermission
            complete={() =>
              setCurrentState(SignUpState.COMPLETED_PERMISSION_LOCATION)
            }
          />
        )}
      </div>
    </Page>
  );
};

export default LoginCallback;
