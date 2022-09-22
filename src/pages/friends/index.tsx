import { useEffect, useState } from 'react';
import { FriendList } from '~/components/friend-list';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { Input } from '~/components/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { addFriend, SearchProfile, searchUsers } from '~/services/friends';
import { useDebounce } from '~/helper/debounce';
import { getStoredUser } from '~/services/auth';
import { useAsync } from 'react-use';
import SearchedUser from '~/components/friends/searched-user';
import { sendSuccessFeedback } from '~/services/haptics';

const MessagesIndex = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchProfile[]>([]);
  const debouncedSearchTerm: string = useDebounce<string>(search, 500);

  const user = useAsync(async () => {
    return getStoredUser();
  });

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setLoading(true);
        if (!user.value) return;
        searchUsers(user.value.id, debouncedSearchTerm).then((res) => {
          setLoading(false);
          console.log('results');
          console.log(res);
          if (res) {
            setSearchResults(res);
          }
        });
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    },
    [debouncedSearchTerm, user.value], // Only call effect if debounced search term changes
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    setSearchResults([]);

    if (value.length) {
      setSearching(true);
      setLoading(true);
    } else {
      setSearching(false);
      setSearchResults([]);
    }
  };

  const addFriendHandler = async (friend: SearchProfile) => {
    if (!user.value) return;
    const res = await addFriend(user.value?.id, friend.id);
    if (res) {
      sendSuccessFeedback();
    }
  };

  return (
    <Page>
      <PageHeader>Friends</PageHeader>

      <div className="px-8">
        <Input
          onUpdate={updateSearch}
          placeholder="Add or search friends"
          type="text"
          cleanable={true}
          leftIcon={
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          }
        />

        <ul className="mt-3">
          {searchResults.length > 0 && (
            <div className="font-semibold">Your search results</div>
          )}
          {searchResults.map((friend, i) => (
            <SearchedUser key={i} friend={friend} onAdd={addFriendHandler} />
          ))}

          {searching && !loading && searchResults.length === 0 && (
            <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
              No result found
            </li>
          )}

          {loading && (
            <li className="flex items-center justify-start gap-2 border-b py-3 px-8 text-sm text-gray-500">
              We are loading your search results.
            </li>
          )}
        </ul>

        <Tab.Group>
          <Tab.List className="fixed bottom-24 flex items-center justify-between rounded-full bg-sky-900 p-2 text-white">
            <Tab
              key={'friends'}
              className={({ selected }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': selected,
                })
              }
            >
              Friends
            </Tab>
            <Tab
              key={'requests'}
              className={({ selected }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': selected,
                })
              }
            >
              Requests
            </Tab>
            <Tab
              key={'messages'}
              onClick={() => navigate('/messages')}
              className={({ selected }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': selected,
                })
              }
            >
              Messages
            </Tab>
          </Tab.List>
          {!searching && (
            <Tab.Panels className="mt-2">
              <Tab.Panel key={'friends'} className="">
                <FriendList />
              </Tab.Panel>
              <Tab.Panel key={'requests'} className="">
                <div>Requests</div>
              </Tab.Panel>
            </Tab.Panels>
          )}
        </Tab.Group>
      </div>
    </Page>
  );
};

export default MessagesIndex;
