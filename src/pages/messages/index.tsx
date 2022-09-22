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
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 transform"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          Messages
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
