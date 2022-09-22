import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '~/components/avatar';
import { Input } from '~/components/input';
import { useDebounce } from '~/helper/debounce';
import { getStoredUser } from '~/services/auth';
import { Profile, searchUsers } from '~/services/friends';

interface FriendNavigationProps {
  searching: boolean;
  setSearching: (searching: boolean) => void;
}

const FriendNavigation = ({
  searching,
  setSearching,
}: FriendNavigationProps) => {
  // const searchFriends = useAsync(async () => {
  //   const user = await getStoredUser();
  //   return searchUsers(user?.id, search);
  // });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
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
      <ul className="border-t">
        {results.map((friend: Profile, i: number) => (
          <li key={i}>
            <a
              href={`/profile/${friend.id}`}
              className="flex items-center justify-start gap-2 border-b py-3"
            >
              <Avatar profile={friend} size={12} />
              <div className="flex flex-col">
                <span className="text-md font-medium">{friend.username}</span>
                <span className="text-sm text-gray-500">
                  Last active {friend.lastSeen}
                </span>
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

      <nav className="fixed bottom-24">
        <ul className="flex items-center justify-between rounded-full bg-sky-900 p-2 text-white">
          <li>
            <NavLink
              to="/friends"
              end
              className={({ isActive }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': isActive,
                })
              }
            >
              Friends
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/friends/requests"
              className={({ isActive }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': isActive,
                })
              }
            >
              Requests
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                clsx('block rounded-full px-4 py-1', {
                  'bg-sky-700': isActive,
                })
              }
            >
              Messages
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default FriendNavigation;
