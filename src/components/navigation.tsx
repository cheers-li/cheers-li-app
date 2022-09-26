import {
  HomeIcon,
  MapIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white px-8 py-6">
        <nav>
          <ul className="flex items-center justify-between">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-sky-600' : undefined
                }
              >
                <HomeIcon className="h-8 w-8" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  isActive ? 'text-sky-600' : undefined
                }
              >
                <MapIcon className="h-8 w-8" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sessions/new"
                className={({ isActive }) =>
                  clsx('block rounded-full px-6 py-2 text-white', {
                    'bg-sky-600': isActive,
                    'bg-dark-gradient': !isActive,
                  })
                }
              >
                <PlusCircleIcon className="h-6 w-6" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  isActive ? 'text-sky-600' : undefined
                }
              >
                <UsersIcon className="h-8 w-8" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? 'text-sky-600' : undefined
                }
              >
                <Cog6ToothIcon className="h-8 w-8" aria-hidden="true" />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
