import dayjs from 'dayjs';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Input } from '~/components/input';
import { Switch } from '~/components/switch';
import { validateStartTime } from '~/helper/validator';

interface ChooseStartTimeProps {
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
}

export const ChooseStartTime: FC<ChooseStartTimeProps> = ({
  startTime,
  setStartTime,
}) => {
  const [startTimeError, setStartTimeError] = useState('');
  const [timeNow] = useState(dayjs());

  const [isSessionNow, setIsSessionNow] = useState(true);

  useEffect(() => {
    setStartTimeError('');
    const error = validateStartTime(startTime, timeNow);
    if (error) {
      setStartTimeError(error);
    }
  }, [startTime]);

  useEffect(() => {
    if (isSessionNow) {
      setStartTime(dayjs().format('HH:mm'));
    }
  }, [isSessionNow]);

  return (
    <>
      <Switch
        checked={isSessionNow}
        onUpdate={setIsSessionNow}
        label="Session starts now"
      />

      {!isSessionNow && (
        <>
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            If the session takes place in the future enter the start time.
          </span>
          <Input
            placeholder="hh:mm"
            label="Start Time"
            value={startTime}
            error={startTimeError}
            onUpdate={setStartTime}
            disabled={false}
          />
        </>
      )}
    </>
  );
};
