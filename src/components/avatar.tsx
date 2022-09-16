import { FC } from 'react';
import { Profile } from '~/services/friends';

interface AvatarProps {
  profile: Profile;
  size?: number;
}

export const Avatar: FC<AvatarProps> = ({ profile, size = 12 }) => (
  <>
    {profile.avatarUrl ? (
      <img
        src={profile.avatarUrl}
        alt={profile.username}
        className={`h-12 w-12 h-${size} w-${size} rounded-full`}
      />
    ) : (
      <div
        className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-sky-800 text-3xl font-extralight text-white`}
      >
        {profile.username.charAt(0).toUpperCase()}
      </div>
    )}
  </>
);
