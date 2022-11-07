import {
  HomeIcon,
  MapIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { NotificationDot } from '~/components/notification-dot';
import { useRequests } from '~/services/friends';
import store from '~/store';

const Navigation = () => {
  const [user] = store.useState<User>('user');
  const { data: requests } = useRequests(user.id);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <nav className="flex items-center justify-between dark:text-neutral-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx('p-3', {
                'text-sky-600 dark:text-sky-400': isActive,
              })
            }
          >
            <HomeIcon className="h-8 w-8" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              clsx('p-3', {
                'text-sky-600 dark:text-sky-400': isActive,
              })
            }
          >
            <MapIcon className="h-8 w-8" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/sessions/new"
            className={({ isActive }) =>
              clsx('group p-3', {
                activate: isActive,
              })
            }
          >
            <div
              className={clsx(
                'block rounded-full px-6 py-2 text-white [.group.activate_&]:bg-sky-600 [.group:not(.activate)_&]:bg-dark-gradient',
              )}
            >
              <PlusCircleIcon className="h-6 w-6" aria-hidden="true" />
            </div>
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              clsx('relative p-3', {
                'text-sky-600 dark:text-sky-400': isActive,
              })
            }
          >
            {requests?.count != null && requests.count > 0 && (
              <div className="absolute right-0 top-0 mt-2 mr-2">
                <NotificationDot />
              </div>
            )}
            <UsersIcon className="h-8 w-8" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx('p-3', {
                'text-sky-600 dark:text-sky-400': isActive,
              })
            }
          >
            <Cog6ToothIcon className="h-8 w-8" aria-hidden="true" />
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
