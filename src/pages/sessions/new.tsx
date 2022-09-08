import { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { getUserId } from '~/services/profile';
import { createNewSession } from '~/services/session';

const NewSession = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!name || name.length == 0) {
        throw 'The name cannot be empty';
      }
      console.log(name);
      const { error: errorMessage } = await createNewSession(name, getUserId());

      if (errorMessage) {
        throw errorMessage.message;
      }
      navigate(`/sessions/${name}`);
    } catch (exception: any) {
      setError(exception);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <PageHeader>Create a new Session</PageHeader>
      <p className="text-sm text-gray-500">
        Click on start to create a new session. Your friends will receive a
        notification that you have started a session.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-6">
        <Input
          placeholder="How should this session be called?"
          label="Session Name"
          value={name}
          error={error}
          onUpdate={setName}
          disabled={isLoading}
        />
        <div className="flex flex-col gap-4">
          <Button primary>Start Session</Button>
        </div>
      </form>
    </Page>
  );
};

export default NewSession;
