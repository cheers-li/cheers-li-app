import dayjs from 'dayjs';

export const getLastActive = (activeAt: string): string => {
  if (!activeAt) {
    return 'a long time ago';
  }

  const now = dayjs();
  const lastActive = dayjs(activeAt);
  const diffSeconds = now.diff(lastActive, 'seconds');

  if (diffSeconds < 60) {
    return `${now.diff(lastActive, 'seconds')}s ago`;
  } else if (diffSeconds < 60 * 60) {
    return `${now.diff(lastActive, 'minutes')}min ago`;
  } else if (diffSeconds < 60 * 60 * 24) {
    return `${now.diff(lastActive, 'hours')}h ago`;
  } else {
    return `${now.diff(lastActive, 'days')} days ago`;
  }
};
