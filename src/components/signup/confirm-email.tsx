import { FC } from 'react';
import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';

interface ConfirmEmailProps {
  complete: () => void;
}

export const ConfirmEmail: FC<ConfirmEmailProps> = ({ complete }) => {
  return (
    <Dialog>
      <div className="flex w-full flex-col gap-6 pt-8 pb-24">
        <h1 className="text-3xl font-bold">Confirm Email</h1>
        <p className="text-sm text-gray-500">
          Please confirm the mail sent to your email address to create your
          profile. Sign in once it is done.
        </p>
        <hr />
        <Button primary onClick={complete}>
          Email confirmed
        </Button>
      </div>
    </Dialog>
  );
};
