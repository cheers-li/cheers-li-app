import { FC } from 'react';
import { Profile } from '~/services/friends';

interface AvatarProps {
  profile: Profile;
  size?: number;
  customClasses?: string;
}

export const Avatar: FC<AvatarProps> = ({
  profile,
  size = 12,
  customClasses = '',
}) => (
  <>
    {profile.avatarUrl ? (
      <img
        src={profile.avatarUrl}
        alt={profile.username}
        className={`h-${size} w-${size} block flex-shrink-0 rounded-full ${customClasses} object-cover`}
      />
    ) : (
      <div
        className={`flex h-${size} w-${size} flex-shrink-0 items-center justify-center rounded-full bg-sky-800 px-4 text-2xl font-extralight text-white dark:bg-sky-600 ${customClasses}`}
      >
        {profile.username.charAt(0).toUpperCase()}
      </div>
    )}
  </>
);
