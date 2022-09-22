import { useEffect, useState } from 'react';
import { FriendList } from '~/components/friend-list';
// import FriendNavigation from '~/components/friends/friend-navigation';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { Input } from '~/components/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Profile, searchUsers } from '~/services/friends';
import { useDebounce } from '~/helper/debounce';
import { getStoredUser } from '~/services/auth';
import { Avatar } from '~/components/avatar';

const MessagesIndex = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const debouncedSearchTerm: string = useDebounce<string>(search, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        console.log('searching for', debouncedSearchTerm);

        setLoading(true);
        getStoredUser().then((user) => {
          if (!user) return;
          searchUsers(user.id, debouncedSearchTerm).then((res) => {
            setLoading(false);
            console.log('results');
            console.log(res);
            if (res) {
              setResults(res);
            }
          });
        });
      } else {
        setResults([]);
        setLoading(false);
      }
    },
    [debouncedSearchTerm], // Only call effect if debounced search term changes
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    if (value.length) {
      setSearching(true);
      setLoading(true);
    } else {
      setSearching(false);
      setResults([]);
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
          {results.length > 0 && (
            <div className="font-semibold">Your search results</div>
          )}
          {results.map((friend: Profile, i: number) => (
            <li key={i}>
              <a
                href={`/profile/${friend.id}`}
                className="flex items-center justify-between border-b py-3"
              >
                <div className="flex items-center justify-start gap-2">
                  <Avatar profile={friend} size={12} />
                  <div className="flex flex-col">
                    <span className="text-md font-medium">
                      {friend.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      Last active {friend.lastSeen}
                    </span>
                  </div>
                </div>
                <div className="">
                  <button className="p-2">
                    <span className="rounded-full bg-sky-200 px-2 py-1 text-xs font-semibold text-sky-900 active:bg-sky-300">
                      ADD
                    </span>
                  </button>
                </div>
              </a>
            </li>
          ))}

          {searching && !loading && results.length === 0 && (
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
