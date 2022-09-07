import { LinkButton } from '~/components/button';

const Welcome = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 py-8 px-8">
      <h1 className="text-5xl font-bold">
        Hey!!
        <br />
        Welcome
      </h1>
      <p className="text-sm text-gray-500">
        We help you to share your free time with your friends and family.
      </p>
      <div className="flex flex-col gap-4">
        <LinkButton primary width="full" href="/register">
          Create an account
        </LinkButton>
        <LinkButton secondary width="full" href="/login">
          I already have an account
        </LinkButton>
      </div>
    </div>
  );
};

export default Welcome;
