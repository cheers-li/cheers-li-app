import { LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const EmailLogin = () => {
  return (
    <Page>
      <PageHeader>Check your Inbox</PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
        <p className="text-sm text-gray-500 dark:text-neutral-300">
          We sent you an e-mail to log into your account.
        </p>
        <LinkButton secondary width="full" href="/welcome">
          Go back
        </LinkButton>
      </div>
    </Page>
  );
};

export default EmailLogin;
