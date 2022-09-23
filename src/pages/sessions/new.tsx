import { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import TagList from '~/components/tag-list';
import { getStoredUser } from '~/services/auth';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { getProfile } from '~/services/profile';
import { createNewSession, Location, Tag } from '~/services/session';
import { LocationList } from '~/components/location-list';

const NewSession = () => {
  const profile = useAsync(async () => {
    const user = await getStoredUser();
    return getProfile(user?.id);
  });
  const [locationTag, setLocationTag] = useState<Tag>();
  const [tag, setTag] = useState<Tag>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log({ locationTag });
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

      if (locationTag && locationTag.type === 'home') {
        locationName = 'at home';
      }
      if (locationTag && locationTag.type === 'hidden') {
        locationName = 'at a nice place.';
      }

      const { id, error: errorMessage } = await createNewSession(
        `${profile.value?.data.username} is drinking ${tag.name} ${tag.emoji}`,
        tag.id,
        coordinates,
        locationName,
      );

      if (errorMessage) {
        throw errorMessage.message;
      }
      sendSuccessFeedback();
      navigate(`/sessions/${id}`);
    } catch (exception: any) {
      setError(exception);
      sendErrorFeedback();
    } finally {
      setIsLoading(false);
    }
  };

  const location = useAsync(async () => {
    const point = await Geolocation.getCurrentPosition();
    const loc: Location = {
      type: 'Point',
      coordinates: [point.coords.latitude, point.coords.longitude],
    };

    return loc;
  });

  return (
    <Page>
      <PageHeader>Create a new Session</PageHeader>
      <form onSubmit={submit} className="flex flex-col gap-4 px-8">
        {error && error !== '' && (
          <span className="text-sm text-red-500">{error}</span>
        )}
        <span className="text-sm text-gray-500">
          Let your friends know what you are drinking
        </span>
        <TagList activeTag={tag} setActiveTag={setTag} />
        <hr />
        {location.loading && (
          <span className="text-sm text-gray-500">
            Loading locations nearby...
          </span>
        )}
        {!location.loading && (
          <>
            <span className="text-sm text-gray-500">
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
        <Button
          primary
          disabled={
            isLoading ||
            location.loading ||
            tag === undefined ||
            locationTag === undefined
          }
        >
          Start Session
        </Button>
      </form>
    </Page>
  );
};

export default NewSession;
