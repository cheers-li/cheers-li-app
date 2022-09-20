import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProfile } from '~/services/profile';
import { Page } from '~/components/page';
import { ConfirmEmail } from '~/components/signup/confirm-email';
import { CreateProfile } from '~/components/signup/create-profile';
import { AskNotificationPermission } from '~/components/signup/ask-notification-permission';
import { AskLocationPermission } from '~/components/signup/ask-location-permission';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from '~/services/supabase-client';
import { User } from '@supabase/supabase-js';
import { storeUser } from '~/services/auth';

enum SignUpState {
  USER_NOT_LOADED,
  CONFIRM_EMAIL,
  CONFIRM_EMAIL_COMPLETE,
  REQUIRE_PROFILE,
  COMPLETED_PROFILE,
  PERMISSION_PUSH_NOTIFICATION,
  COMPLETED_PERMISSION_PUSH_NOTIFICATION,
  PERMISSION_LOCATION,
  COMPLETED_PERMISSION_LOCATION,
  COMPLETED,
}

const LoginCallback = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>();

  const [showUserLoading, setShowUserLoading] = useState(false);
  const [showConfirmEmailDialog, setShowConfirmEmailDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const [currentState, setCurrentState] = useState<SignUpState>();

  const hasProfile = async () => {
    const { error } = await getProfile(user?.id);
    return !error;
  };

  const onStateChange = async () => {
    switch (currentState) {
      case SignUpState.USER_NOT_LOADED: {
        setShowUserLoading(true);

        setTimeout(() => {
          setCurrentState(SignUpState.CONFIRM_EMAIL);
        }, 500);
        break;
      }
      case SignUpState.CONFIRM_EMAIL: {
        const session = supabase.auth.session();
        if (!session || !session.access_token) {
          break;
        }

        const result = await supabase.auth.api.getUser(session.access_token);
        setUser(result.user);
        storeUser(result.user);

        if (!user || !user.confirmed_at) {
          setCurrentState(SignUpState.USER_NOT_LOADED);
          break;
        }

        if (!user?.confirmed_at) {
          setShowConfirmEmailDialog(true);
        } else {
          setCurrentState(SignUpState.CONFIRM_EMAIL_COMPLETE);
        }

        break;
      }
      case SignUpState.CONFIRM_EMAIL_COMPLETE:
        setShowConfirmEmailDialog(false);
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

        const permission = await Geolocation.checkPermissions();
        if (
          permission.location === 'granted' ||
          permission.location === 'denied'
        ) {
          setCurrentState(SignUpState.COMPLETED_PERMISSION_LOCATION);
        }

        setShowLocationDialog(true);
        break;
      }
      case SignUpState.COMPLETED_PERMISSION_LOCATION:
        setShowLocationDialog(false);
        setCurrentState(SignUpState.COMPLETED);
        break;
      case SignUpState.COMPLETED:
        navigate('/');
        break;
    }
  };

  useEffect(() => {
    const wait = setTimeout(() => {
      setCurrentState(SignUpState.CONFIRM_EMAIL);
    }, 500);

    return () => clearTimeout(wait);
  }, []);

  useEffect(() => {
    onStateChange();
  }, [currentState]);

  return (
    <Page hideNavigation={true}>
      <div className="flex w-full flex-col gap-6 px-8">
        {showUserLoading && (
          <p className="text-sm text-gray-500">
            One moment, we are loading your user account.
          </p>
        )}
        {showConfirmEmailDialog && (
          <ConfirmEmail
            complete={() => setCurrentState(SignUpState.CONFIRM_EMAIL_COMPLETE)}
          />
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
