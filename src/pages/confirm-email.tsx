import { useNavigate } from 'react-router';
import { Page } from '~/components/page';
import { ConfirmEmail } from '~/components/signup/confirm-email';

const Search = () => {
  const navigate = useNavigate();
  return (
    <Page hideNavigation={true}>
      <ConfirmEmail complete={() => navigate('/welcome')} />
    </Page>
  );
};

export default Search;
