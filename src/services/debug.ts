import { Toast } from '@capacitor/toast';

export const debugToasts = async (
  message: string,
  duration?: 'short' | 'long' | undefined,
  position?: 'center' | 'bottom' | 'top' | undefined,
) => {
  if (process.env.NODE_ENV === 'development') {
    await Toast.show({
      text: message,
      duration: duration,
      position: position,
    });
  }
};
