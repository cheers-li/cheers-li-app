import { Haptics, NotificationType } from '@capacitor/haptics';

export const sendSuccessFeedback = () => {
  Haptics.notification({ type: NotificationType.Success });
};

export const sendWarningFeedback = () => {
  Haptics.notification({ type: NotificationType.Warning });
};

export const sendErrorFeedback = () => {
  Haptics.notification({ type: NotificationType.Error });
};
