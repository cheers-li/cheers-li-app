import { useEffect, useState } from 'react';
import { FriendList } from '~/components/friends/friend-list';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { Input } from '~/components/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { addFriend, SearchProfile, searchUsers } from '~/services/friends';
import { useDebounce } from '~/helper/debounce';
import { SearchedUserItem } from '~/components/friends/searched-user-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { RequestList } from '~/components/friends/request-list';
import { List } from '~/components/list/list';
import store from '~/store';
import { User } from '@supabase/supabase-js';

const MessagesIndex = () => {
  const [user] = store.useState<User>('user');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchProfile[]>([]);
  const debouncedSearchTerm: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      searchUsers(debouncedSearchTerm, user.id).then((res) => {
        setLoading(false);
        if (res && res.length) {
          setSearchResults(res);
        }
      });
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [debouncedSearchTerm, user.id]);

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
    const res = await addFriend(user.id, friend.id);
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
          currentValue={search}
        />
      </div>

      {searching && (
        <List
          title="Profiles"
          loading={loading}
          items={searchResults}
          count={searchResults?.length}
          ItemComponent={({ item }) => (
            <SearchedUserItem item={item} onAdd={addFriendHandler} />
          )}
        />
      )}

      {!searching && (
        <Tab.Group onChange={() => sendSuccessFeedback()}>
          <Tab.List className="fixed bottom-24 left-1/2 flex -translate-x-1/2 transform items-center justify-between rounded-full bg-sky-900 p-2 text-white dark:bg-neutral-900">
            <Tab
              key={'friends'}
              className={({ selected }) =>
                clsx('block rounded-full px-4 py-1 outline-none', {
                  'bg-sky-700 dark:bg-neutral-700': selected,
                })
              }
            >
              Friends
            </Tab>
            <Tab
              key={'requests'}
              className={({ selected }) =>
                clsx('block rounded-full px-4 py-1 outline-none', {
                  'bg-sky-700 dark:bg-neutral-700': selected,
                })
              }
            >
              Requests
            </Tab>
          </Tab.List>
          {
            <Tab.Panels>
              <Tab.Panel key={'friends'} className="">
                <FriendList />
              </Tab.Panel>
              <Tab.Panel key={'requests'} className="">
                <RequestList />
              </Tab.Panel>
            </Tab.Panels>
          }
        </Tab.Group>
      )}
    </Page>
  );
};

export default MessagesIndex;
