import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getProfile, getUserId } from '~/services/profile';
import { Page } from '~/components/page';
import { ConfirmEmail } from '~/components/signup/confirm-email';
import { CreateProfile } from '~/components/signup/create-profile';
import { AskNotificationPermission } from '~/components/signup/ask-notification-permission';
import { AskLocationPermission } from '~/components/signup/ask-location-permission';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

enum SignUpState {
  CONFIRM_EMAIL,
  REQUIRE_PROFILE,
  COMPLETED_PROFILE,
  PERMISSION_PUSH_NOTIFICATION,
  COMPLETED_PERMISSION_PUSH_NOTIFICATION,
  PERMISSION_LOCATION,
  COMPLETED_PERMISSION_LOCATION,
  COMPLETED,
}

const hasProfile = async () => {
  const { error } = await getProfile(getUserId());
  return !error;
};

const LoginCallback = () => {
  const navigate = useNavigate();

  const [showConfirmEmailDialog, setShowConfirmEmailDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const [currentState, setCurrentState] = useState<SignUpState>();

  const onStateChange = async () => {
    switch (currentState) {
      case SignUpState.REQUIRE_PROFILE: {
        const isVerified = getUserId() != 'UNKNOWN';
        if (!isVerified) {
          setCurrentState(SignUpState.CONFIRM_EMAIL);
          setShowConfirmEmailDialog(true);
          break;
        }

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
      setCurrentState(SignUpState.REQUIRE_PROFILE);
    }, 500);

    return () => clearTimeout(wait);
  }, []);

  useEffect(() => {
    onStateChange();
  }, [currentState]);

  return (
    <Page hideNavigation={true}>
      <div className="flex w-full flex-col gap-6 px-8">
        {showConfirmEmailDialog && (
          <ConfirmEmail complete={() => navigate('/login')} />
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
