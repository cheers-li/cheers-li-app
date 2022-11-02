import { useEffect, useRef, useState } from 'react';
import { FriendList } from '~/components/friends/friend-list';
import { Page } from '~/components/page';
import { PageHeader } from '~/components/page-header';
import { Tab } from '@headlessui/react';
import { Input } from '~/components/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  addFriend,
  Profile,
  SearchProfile,
  searchUsers,
} from '~/services/friends';
import { useDebounce } from '~/helper/debounce';
import { SearchedUserItem } from '~/components/friends/searched-user-item';
import { sendSuccessFeedback } from '~/services/haptics';
import { RequestList } from '~/components/friends/request-list';
import { List } from '~/components/list/list';
import store from '~/store';
import { User } from '@supabase/supabase-js';
import { useEffectOnce } from 'react-use';
import { ElementList } from '~/types/List';
import { NotificationDot } from '~/components/notification-dot';

const MessagesIndex = () => {
  const [user] = store.useState<User>('user');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchProfile[]>([]);
  const debouncedSearchTerm = useDebounce<string>(search, 500);

  const tabsParent = useRef<HTMLDivElement>(null);
  const tabsRef = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];
  const [activeTabAttributes, setActiveTabAttributes] = useState({
    width: 0,
    left: 0,
  });

  const [requests] = store.useState<ElementList<Profile>>('friendRequests');

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

  const updateTabIndex = (index: number, feedback = true) => {
    const bouds = tabsRef[index].current?.getBoundingClientRect();
    const parentBounds = tabsParent.current?.getBoundingClientRect();

    if (bouds && parentBounds) {
      setActiveTabAttributes({
        width: bouds.width,
        left: bouds.left - parentBounds.left,
      });
    }

    if (feedback) {
      sendSuccessFeedback();
    }
  };

  // Set default open tab
  useEffectOnce(() => {
    updateTabIndex(0, false);
  });

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
        <Tab.Group onChange={updateTabIndex}>
          <Tab.List className="fixed bottom-24 left-1/2 z-10 -translate-x-1/2 transform rounded-full bg-sky-900 p-2 text-white dark:bg-neutral-900">
            <div ref={tabsParent} className="flex items-center justify-center">
              <div
                className="fixed left-0 h-8 w-24 rounded-full bg-sky-700 transition-all duration-300 ease-in-out dark:bg-neutral-700"
                style={{
                  width: `${activeTabAttributes.width}px`,
                  left: `calc(${activeTabAttributes.left}px + 0.5rem)`,
                }}
              ></div>
              <Tab
                key={'friends'}
                ref={tabsRef[0]}
                className="relative block rounded-full px-6 py-1 outline-none"
              >
                Friends
              </Tab>
              <Tab
                key={'requests'}
                ref={tabsRef[1]}
                className="relative block rounded-full px-6 py-1 outline-none"
              >
                Requests
                {requests.count != null && requests.count > 0 && (
                  <div className="absolute right-0 top-0 mt-2 mr-2">
                    <NotificationDot />
                  </div>
                )}
              </Tab>
            </div>
          </Tab.List>
          {
            <Tab.Panels>
              <Tab.Panel key={'friends'}>
                <FriendList />
              </Tab.Panel>
              <Tab.Panel key={'requests'}>
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
