import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import TagList from '~/components/tag-list';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { createNewSession, Location, Tag } from '~/services/session';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { Profile } from '~/services/friends';
import dayjs from 'dayjs';
import { ChooseLocation } from '~/components/session/choose-location';
import { ChooseStartTime } from '~/components/session/choose-start-time';
import { ChooseTitle } from '~/components/session/choose-title';
import { BackButton } from '~/components/header/back-button';

const NewSession = () => {
  const navigate = useNavigate();

  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile>('profile');

  const [selectedLocation, selectLocation] = useState<Tag>();
  const [coordinates, setCoordinates] = useState<Location>();
  const [selectedDrink, selectDrink] = useState<Tag>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(dayjs().format('HH:mm'));
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (profile && selectedDrink) {
      setTitle(
        `${profile.username} is drinking ${selectedDrink.name} ${selectedDrink.emoji}`,
      );
    }
  }, [selectedDrink, profile]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!selectedDrink || selectedDrink.id <= 0) {
        throw 'Select a drink';
      }

      let locationName = 'at a nice place.';
      if (selectedLocation && selectedLocation.type !== 'other') {
        locationName = selectedLocation.name;
      }

      const [hour, minute] = startTime.split(':');
      const sessionStartTime = dayjs()
        .hour(parseInt(hour))
        .minute(parseInt(minute));

      const { id, error: errorMessage } = await createNewSession(
        title,
        selectedDrink.id,
        user.id,
        sessionStartTime,
        coordinates,
        locationName,
      );

      if (errorMessage) {
        throw errorMessage.message;
      }
      sendSuccessFeedback();
      navigate(`/sessions/${id}`);
    } catch (exception: unknown) {
      if (exception instanceof String) {
        setError(exception as string);
      }
      sendErrorFeedback();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page hideNavigation>
      <PageHeader LeftComponent={<BackButton disabled={false} />}>
        New Session
      </PageHeader>
      <form onSubmit={submit} className="flex flex-col gap-4 px-8">
        {error && error !== '' && (
          <span className="text-sm text-red-500">{error}</span>
        )}
        <span className="text-sm text-gray-500 dark:text-neutral-400">
          Let your friends know what you are drinking
        </span>
        <TagList activeTag={selectedDrink} setActiveTag={selectDrink} />
        <hr className="dark:border-neutral-800" />
        <ChooseLocation
          selectedDrink={selectedDrink}
          selectLocation={selectLocation}
          selectedLocation={selectedLocation}
          setCoordinates={setCoordinates}
        />
        <hr className="dark:border-neutral-800" />
        <ChooseStartTime startTime={startTime} setStartTime={setStartTime} />
        <hr className="dark:border-neutral-800" />
        <ChooseTitle sessionTitle={title} setSessionTitle={setTitle} />
        <hr className="dark:border-neutral-800" />
        <Button primary disabled={isLoading || selectedDrink === undefined}>
          Start Session
        </Button>
      </form>
    </Page>
  );
};

export default NewSession;
