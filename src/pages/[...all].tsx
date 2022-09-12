import { LinkButton } from '~/components/button';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';

export default function NotFound() {
  return (
    <Page>
      <PageHeader>Page not found</PageHeader>
      <div className="flex w-full flex-col gap-6 px-8">
        <LinkButton primary href="/">
          Got back home
        </LinkButton>
      </div>
    </Page>
  );
}
