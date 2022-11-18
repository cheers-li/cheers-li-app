import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import TagList from '~/components/tag-list';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { createNewSession, Location, Tag } from '~/services/session';
import { LocationList } from '~/components/location-list';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { Profile } from '~/services/friends';
import { Input } from '~/components/input';
import dayjs from 'dayjs';

const NewSession = () => {
  const [user] = store.useState<User>('user');
  const [profile] = store.useState<Profile>('profile');
  const [locationTag, setLocationTag] = useState<Tag>();
  const [tag, setTag] = useState<Tag>();

  const [timeNow] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState(dayjs().format('HH:mm'));
  const [startTimeError, setStartTimeError] = useState('');

  useEffect(() => {
    setStartTimeError('');
    const valid = startTime.match(/^[0-9]{1,2}:[0-9]{2}$/g);
    if (!valid) {
      setStartTimeError('Start time is not valid use hh:mm format.');
    }

    const [hour, minute] = startTime.split(':');
    const timeSession = dayjs().hour(parseInt(hour)).minute(parseInt(minute));

    if (timeSession.isBefore(timeNow)) {
      setStartTimeError('Start time needs to be now or later today.');
    }
  }, [startTime]);

  const location = useAsync(async () => {
    const point = await Geolocation.getCurrentPosition();
    const loc: Location = {
      type: 'Point',
      coordinates: [point.coords.latitude, point.coords.longitude],
    };

    return loc;
  });

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!tag || tag.id <= 0) {
        throw 'Select a drink';
      }
      if (!locationTag || locationTag.id < 0) {
        throw 'Select a location';
      }

      let coordinates;
      if (location.value && locationTag && locationTag.type !== 'hidden') {
        coordinates = location.value;
      }
      let locationName;
      if (locationTag && locationTag.type !== 'other') {
        locationName = locationTag.name;
      }
      if (locationTag && locationTag.type === 'hidden') {
        locationName = 'at a nice place.';
      }

      const [hour, minute] = startTime.split(':');
      const sessionStartTime = dayjs()
        .hour(parseInt(hour))
        .minute(parseInt(minute));

      const { id, error: errorMessage } = await createNewSession(
        `${profile.username} is drinking ${tag.name} ${tag.emoji}`,
        tag.id,
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
    <Page>
      <PageHeader>New Session</PageHeader>
      <form onSubmit={submit} className="flex flex-col gap-4 px-8">
        {error && error !== '' && (
          <span className="text-sm text-red-500">{error}</span>
        )}
        <span className="text-sm text-gray-500 dark:text-neutral-400">
          Let your friends know what you are drinking
        </span>
        <TagList activeTag={tag} setActiveTag={setTag} />
        <hr className="dark:border-neutral-800" />
        {location.loading && (
          <span className="text-sm text-gray-500 dark:text-neutral-400">
            Loading locations nearby...
          </span>
        )}
        {!location.loading && (
          <>
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              Choose the location you want to share with your friends
            </span>
            <LocationList
              location={location.value}
              selectedDrink={tag}
              activeTag={locationTag}
              setActiveTag={setLocationTag}
            />
          </>
        )}
        <hr className="dark:border-neutral-800" />
        <span className="text-sm text-gray-500 dark:text-neutral-400">
          Add a start time if you plan a session.
        </span>
        <Input
          placeholder="hh:mm"
          label="Start Time"
          value={startTime}
          error={startTimeError}
          onUpdate={setStartTime}
          disabled={false}
        />
        <hr className="dark:border-neutral-800" />
        <Button
          primary
          disabled={
            isLoading ||
            location.loading ||
            tag === undefined ||
            locationTag === undefined ||
            startTimeError !== ''
          }
        >
          Start Session
        </Button>
      </form>
    </Page>
  );
};

export default NewSession;
