import { User } from '@supabase/supabase-js';
import { FC, SyntheticEvent, useState } from 'react';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { createNewProfile } from '~/services/profile';
import store from '~/store';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Input } from '~/components/input';

interface CreateProfileProps {
  complete: () => void;
}

export const CreateProfile: FC<CreateProfileProps> = ({ complete }) => {
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [user] = store.useState<User>('user');
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');

  const submitProfileName = async (e: SyntheticEvent) => {
    e.preventDefault();

    setUserNameError('');
    setIsProfileLoading(true);

    try {
      const { error } = await createNewProfile(user.id, userName);

      if (error) {
        sendErrorFeedback();
        if (error.message.includes('duplicate key value')) {
          setUserNameError(
            'The username you choose is already used by someone else. Choose a unique username.',
          );
        } else if (error.message.includes('invalid input syntax')) {
          setUserNameError('Please fill in a correct username');
        }
      } else {
        sendSuccessFeedback();
        complete();
      }
    } catch {
      sendErrorFeedback();
      setUserNameError('Something went wrong. Try again later.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <Dialog closeModal={() => undefined}>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24 text-black dark:text-white">
        <h1 className="text-3xl font-bold">Complete your Profile</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          We need some more information to complete your profile.
        </p>
        <hr className="dark:border-neutral-800" />
        <form onSubmit={submitProfileName} className="flex flex-col gap-6">
          <Input
            placeholder="How should we call you?"
            label="Username"
            value={userName}
            error={userNameError}
            onUpdate={setUserName}
            disabled={isProfileLoading}
          />
          <div className="flex flex-col gap-4">
            <Button primary width="full" disabled={isProfileLoading}>
              Set Username
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
