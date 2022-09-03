import {
  EnvelopeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import SideMenu from './side-menu';

const Navigation = () => {
  return (
    <>
      <SideMenu />
      <div className="fixed bottom-6 left-6 right-6 flex items-center justify-between">
        <nav className="h-20 rounded-full bg-black px-8 text-white">
          <ul className="flex h-full items-center space-x-12">
            <li>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  isActive ? 'text-blue-200' : undefined
                }
              >
                <MapIcon className="h-6 w-6" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive ? 'text-blue-200' : undefined
                }
              >
                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? 'text-blue-200' : undefined
                }
              >
                <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
              </NavLink>
            </li>
          </ul>
        </nav>
        <NavLink
          to="/sessions/new"
          className={({ isActive }) =>
            isActive ? 'text-blue-200' : 'text-white'
          }
        >
          <button className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-400 p-3 hover:bg-blue-300">
            <PlusCircleIcon className="h-12 w-12" aria-hidden="true" />
          </button>
        </NavLink>
      </div>
    </>
  );
};

export default Navigation;
