import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Switch } from '~/components/switch';
import { Input } from '~/components/input';

interface ChooseTitleProps {
  sessionTitle: string;
  setSessionTitle: Dispatch<SetStateAction<string>>;
}

export const ChooseTitle: FC<ChooseTitleProps> = ({
  sessionTitle,
  setSessionTitle,
}) => {
  const [useDefaultTitle, setUseDefaultTitle] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!sessionTitle || sessionTitle === '') {
      setError('Title cannot be empty');
    }
  }, [sessionTitle]);

  return (
    <>
      <Switch
        checked={useDefaultTitle}
        onUpdate={setUseDefaultTitle}
        label="Use default title"
      />

      {!useDefaultTitle && (
        <>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            Set a custom session title to let your friends know what you are
            doing.
          </span>
          <Input
            placeholder="What are you doing?"
            label="Session Title"
            value={sessionTitle}
            error={error}
            onUpdate={setSessionTitle}
            disabled={false}
          />
        </>
      )}
    </>
  );
};
