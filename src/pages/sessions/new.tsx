import { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import { Button } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import TagList from '~/components/tag-list';
import { sendErrorFeedback, sendSuccessFeedback } from '~/services/haptics';
import { getProfile, getUserId } from '~/services/profile';
import { createNewSession, Tag } from '~/services/session';

const NewSession = () => {
  const profile = useAsync(() => getProfile(getUserId()));
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
        getUserId(),
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
