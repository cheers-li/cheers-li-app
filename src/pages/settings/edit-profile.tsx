import { CameraIcon } from '@heroicons/react/24/outline';
import { FC, useState } from 'react';
import { useAsync } from 'react-use';
import clsx from 'clsx';
import { Avatar } from '~/components/avatar';
import { BackButton } from '~/components/header/back-button';
import { Input } from '~/components/input';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { getStoredUser } from '~/services/auth';
import { getProfile, updateProfile } from '~/services/profile';
import { useNavigate } from 'react-router';

const EditProfile = () => {
  const navigate = useNavigate();
  const profile = useAsync(async () => {
    const user = await getStoredUser();
    const { data } = await getProfile(user?.id);

    setUserName(data.username);
    setBio(data.bio);
    setLocation(data.city);

    return { ...data, user };
  });

  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await updateProfile(profile.value.id, userName, bio, location);
    setLoading(false);
    navigate(-1);
  };

  return (
    <Page hideNavigation>
      <PageHeader
        LeftComponent={<BackButton />}
        RightComponent={<SaveButton onClick={save} disabled={loading} />}
      >
        Edit Profile
      </PageHeader>

      {!profile.loading && (
        <div className="flex flex-col items-center gap-4 px-4">
          <div className="w-26 relative">
            <Avatar profile={profile.value} size={26} />
            <CameraIcon className="absolute bottom-0 right-0 w-8 rounded-full border-2 border-sky-600 bg-sky-600 p-1 text-white" />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Input
              placeholder="Username"
              label="Username"
              value={userName}
              onUpdate={setUserName}
              disabled={loading}
            />
            <Input
              placeholder="Bio"
              label="Bio"
              value={bio}
              onUpdate={setBio}
              disabled={loading}
            />
            <Input
              placeholder="Location"
              label="Location"
              value={location}
              onUpdate={setLocation}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </Page>
  );
};

interface SaveButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

const SaveButton: FC<SaveButtonProps> = ({ onClick, disabled = false }) => (
  <span
    onClick={onClick}
    className={clsx('text-md', { 'text-gray-500': !disabled })}
  >
    Save
  </span>
);

export default EditProfile;
