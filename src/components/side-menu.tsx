import { NavLink } from 'react-router-dom';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import store from '~/store';
import clsx from 'clsx';
import { supabase } from '~/services/supabase-client';
import { useState } from 'react';
import { signOut } from '~/services/auth';

const getLinkClasses = (isActive: boolean) =>
  clsx('block border-l-4  py-2 pl-3 pr-4 text-base font-medium', {
    'border-sky-500 bg-sky-50 text-sky-700': isActive,
    'border-transparent text-gray-500 active:border-gray-300 active:bg-gray-50 active:text-gray-700':
      !isActive,
  });

const SideMenu = () => {
  const [isOpen, setIsOpen] = store.useState<boolean>('menuOpen');
  const [user] = useState(supabase.auth.user());
  const logout = () => signOut();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed z-20 bg-white">
      <>
        {isOpen && (
          <div className="h-screen w-screen">
            <div className="mx-auto px-4">
              <div className="flex h-16 justify-between">
                <div className="flex items-center">
                  <button
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 active:bg-gray-100 active:text-gray-500"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isOpen ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-1 pt-2 pb-3">
              <NavLink
                to="/map"
                onClick={toggleMenu}
                className="block border-l-4 border-sky-500 bg-sky-50 py-2 pl-3 pr-4 text-base font-medium text-sky-700"
              >
                Map
              </NavLink>
              <NavLink
                to="/search"
                onClick={toggleMenu}
                className={({ isActive }) => getLinkClasses(isActive)}
              >
                Search
              </NavLink>
              <NavLink
                to="/messages"
                onClick={toggleMenu}
                className={({ isActive }) => getLinkClasses(isActive)}
              >
                Messages
              </NavLink>
              <NavLink
                to="/sessions/new"
                onClick={toggleMenu}
                className={({ isActive }) => getLinkClasses(isActive)}
              >
                New session
              </NavLink>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.user_metadata.avatar_url}
                    alt="Profile icon"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.user_metadata.full_name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink
                  to="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 active:bg-gray-100 active:text-gray-800"
                  onClick={toggleMenu}
                >
                  Your Profile
                </NavLink>
                <NavLink
                  to="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 active:bg-gray-100 active:text-gray-800"
                  onClick={toggleMenu}
                >
                  Settings
                </NavLink>
                <button
                  type="button"
                  className="block px-4 py-2 text-base font-medium text-gray-500 active:bg-gray-100 active:text-gray-800"
                  onClick={logout}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SideMenu;
