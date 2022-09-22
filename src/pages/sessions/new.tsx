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
import { LocationTag } from '~/components/location-tag';

const NewSession = () => {
  const profile = useAsync(async () => {
    const user = await getStoredUser();
    return getProfile(user?.id);
  });
  const [tag, setTag] = useState<Tag>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!tag || tag.id <= 0) {
        throw 'The tag is required';
      }

      const { id, error: errorMessage } = await createNewSession(
        `${profile.value?.data.username} is drinking ${tag.name} ${tag.emoji}`,
        tag.id,
        location.value,
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
      <div className="flex w-full flex-col gap-6 px-8">
        <p className="text-sm text-gray-500">
          Click on start to create a new session. Your friends will receive a
          notification that you have started a session.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-6">
          <div>
            <span className="text-sm text-gray-500">Choose a tag</span>
            <TagList activeTag={tag} setActiveTag={setTag} />
            <div className="h-4">
              {error && error !== '' && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </div>
          </div>
          {location && location.value && (
            <div>
              <span className="text-sm text-gray-500">Your Location: </span>
              <LocationTag location={location.value} />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <Button primary disabled={isLoading}>
              Start Session
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default NewSession;
