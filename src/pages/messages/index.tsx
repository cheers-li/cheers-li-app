import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import { LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const MessagesIndex = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate(-1)}>
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <span>Messages</span>
        </div>
      </PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
        <LinkButton secondary width="full" href="/">
          Go back home
        </LinkButton>
      </div>
    </Page>
  );
};

export default MessagesIndex;
