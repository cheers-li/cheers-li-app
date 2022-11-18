import { FC } from 'react';
import { uploadReaction } from '~/services/reactions';
import { Button } from '~/components/button';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface SessionReactionsProps {
  sessionId: string;
  profileId: string;
  refetch: () => unknown;
}

export const CreateSessionReaction: FC<SessionReactionsProps> = ({
  sessionId,
  profileId,
  refetch,
}) => {
  const createReaction = async () => {
    const image = await Camera.getPhoto({
      quality: 50,
      width: 500,
      height: 500,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (!image.base64String) {
      return;
    }

    await uploadReaction(sessionId, image.base64String, profileId);
    refetch();
  };

  return (
    <Button primary onClick={createReaction}>
      Add Reaction
    </Button>
  );
};
