import dayjs from 'dayjs';

export const validateEmail = (email: string): boolean =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?_\-*+§°"#^$€{}()%=&[\]/.\\#\s]).{8,}$/.test(
    password,
  );

export const validateStartTime = (
  startTime: string,
  timeNow: dayjs.Dayjs,
): string | undefined => {
  const valid = startTime.match(/^[0-9]{1,2}:[0-9]{2}$/g);
  if (!valid) {
    return 'Start time is not valid use hh:mm format.';
  }

  const [hour, minute] = startTime.split(':');
  const timeSession = dayjs().hour(parseInt(hour)).minute(parseInt(minute));

  if (timeSession.isBefore(timeNow)) {
    return 'Start time needs to be now or later today.';
  }
};
