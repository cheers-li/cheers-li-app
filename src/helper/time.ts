import dayjs from 'dayjs';

export const getLastActive = (activeAt?: string, postfix = ' ago'): string => {
  if (!activeAt) {
    return 'a long time ago';
  }

  const now = dayjs();
  const lastActive = dayjs(activeAt);
  const diffSeconds = now.diff(lastActive, 'seconds');

  if (diffSeconds < 60) {
    return `${now.diff(lastActive, 'seconds')}s${postfix}`;
  } else if (diffSeconds < 60 * 60) {
    return `${now.diff(lastActive, 'minutes')}min${postfix}`;
  } else if (diffSeconds < 60 * 60 * 24) {
    return `${now.diff(lastActive, 'hours')}h${postfix}`;
  } else if (diffSeconds < 60 * 60 * 24 * 7) {
    return `${now.diff(lastActive, 'days')} days${postfix}`;
  } else if (diffSeconds < 60 * 60 * 24 * 7 * 5) {
    return `${now.diff(lastActive, 'weeks')} weeks${postfix}`;
  } else if (diffSeconds < 60 * 60 * 24 * 7 * 4 * 10) {
    return `${now.diff(lastActive, 'months')} months${postfix}`;
  } else {
    return `${now.diff(lastActive, 'years')} years${postfix}`;
  }
};
