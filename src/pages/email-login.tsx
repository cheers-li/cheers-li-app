import { LinkButton } from '../components/button';

const EmailLogin = () => {
  return (
    <div className="flex w-full flex-col gap-6 py-8 px-8">
      <h1 className="text-center text-xl font-bold">Check your Inbox</h1>
      <p className="text-center text-sm text-gray-500">
        We sent you an e-mail to log into your account.
      </p>
      <LinkButton secondary width="full" href="/welcome">
        Go back
      </LinkButton>
    </div>
  );
};

export default EmailLogin;
