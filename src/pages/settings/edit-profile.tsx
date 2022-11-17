import { CameraIcon } from '@heroicons/react/24/outline';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Avatar } from '~/components/avatar';
import { BackButton } from '~/components/header/back-button';
import { Input } from '~/components/input';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { updateProfile } from '~/services/profile';
import { useNavigate } from 'react-router';
import { generateSimpleKey, uploadAvatar } from '~/services/avatar';
import store from '~/store';
import { Profile } from '~/services/friends';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile] = store.useState<Profile>('profile');

  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserName(profile.username);
    setBio(profile.bio || '');
    setLocation(profile.city || '');
  }, [profile]);

  const save = async () => {
    setLoading(true);
    await updateProfile({
      id: profile.id,
      username: userName,
      bio,
      city: location,
    });
    setLoading(false);
    navigate(-1);
  };

  const changePicture = async () => {
    setLoading(true);
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    if (image.dataUrl) {
      const key = generateSimpleKey();
      const { publicURL } = await uploadAvatar(
        image.dataUrl,
        `${profile.id}-${key}.${image.format}`,
      );
      if (publicURL) {
        await updateProfile({
          id: profile.id,
          username: userName,
          bio,
          city: location,
          avatarUrl: publicURL,
        });
      }
    }

    setLoading(false);
    navigate(-1);
  };

  return (
    <Page hideNavigation>
      <PageHeader
        LeftComponent={<BackButton disabled={loading} />}
        RightComponent={<SaveButton onClick={save} disabled={loading} />}
      >
        Edit Profile
      </PageHeader>

      <div className="flex flex-col items-center gap-4 px-4">
        <div className="w-26 relative" onClick={changePicture}>
          <Avatar profile={profile} size={40} />
          <CameraIcon className="absolute bottom-0 right-0 w-10 rounded-full border-2 border-sky-600 bg-sky-600 p-1 text-white" />
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
    className={clsx('text-md', { 'text-gray-500 dark:text-white': !disabled })}
  >
    Save
  </span>
);

export default EditProfile;
