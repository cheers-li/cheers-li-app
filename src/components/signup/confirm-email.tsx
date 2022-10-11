import { FC } from 'react';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';

interface ConfirmEmailProps {
  complete: () => void;
}

export const ConfirmEmail: FC<ConfirmEmailProps> = ({ complete }) => {
  return (
    <Dialog closeModal={() => undefined}>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24 text-black dark:text-white">
        <h1 className="text-3xl font-bold">Confirm Email</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          Please confirm the mail sent to your email address to create your
          profile. Sign in once it is done.
        </p>
        <hr className="dark:border-neutral-800" />
        <Button primary onClick={complete}>
          Go Back Home
        </Button>
      </div>
    </Dialog>
  );
};
