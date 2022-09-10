import { LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

const Search = () => {
  return (
    <Page>
      <PageHeader>Search</PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
        <LinkButton secondary width="full" href="/">
          Go back home
        </LinkButton>
      </div>
    </Page>
  );
};

export default Search;
