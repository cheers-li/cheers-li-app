import { LinkButton } from '~/components/button';
// import FriendNavigation from '~/components/friends/friend-navigation';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const MessagesIndex = () => {
  return (
    <Page>
      <PageHeader>Requests</PageHeader>
      {/* <FriendNavigation /> */}
      <div className="flex w-full flex-col gap-6 px-8">
        <LinkButton secondary width="full" href="/">
          Go back home
        </LinkButton>
      </div>
    </Page>
  );
};

export default MessagesIndex;
